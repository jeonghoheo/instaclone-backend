import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import client from "../client";
import {
  CreateAccountInput,
  CreateAccountOutput
} from "./dtos/create-account.dto";
import { User } from "./entities/user.entity";
import { SeeProfileOutput } from "./dtos/see-profile.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { ContextType } from "../common/custom-auth-checker/custom-auth-checker";
import { FollowUserInput, FollowUserOutput } from "./dtos/follow-user.dto";
import {
  UnFollowUserInput,
  UnFollowUserOutput
} from "./dtos/un-follow-user.dto";
import {
  SeeFollowersInput,
  SeeFollowersOutput
} from "./dtos/see-followers.dto";
import {
  SeeFollowingInupt,
  SeeFollowingOutput
} from "./dtos/see-following.dto";
import { Photo } from "../photos/entities/photo.entity";
import { uploadToS3 } from "../shared/shared.utils";
import { MeOutput } from "./dtos/me.dto";

@Resolver((of) => User)
export class UserResolver {
  @Authorized()
  @Query((returns) => MeOutput)
  async me(@Ctx() { user }: ContextType): Promise<MeOutput> {
    try {
      const me = await client.user.findUnique({
        where: {
          id: user.id
        }
      });
      if (!me) {
        return {
          ok: false,
          error: "You are not a correct user"
        };
      }
      return {
        ok: true,
        me
      };
    } catch (error) {
      return {
        ok: false,
        error: "You are not a logged in user"
      };
    }
  }

  @Query((returns) => SeeProfileOutput)
  async seeProfile(
    @Arg("username") username: string
  ): Promise<SeeProfileOutput> {
    const user = await client.user.findUnique({
      where: {
        username
      },
      include: {
        following: true,
        followers: true
      }
    });
    if (!user) {
      return {
        ok: false,
        error: "User not found."
      };
    }
    return {
      ok: true,
      user
    };
  }

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Arg("input")
    { firstName, lastName, username, email, password }: CreateAccountInput
  ): Promise<CreateAccountOutput> {
    try {
      const exsitingUser = await client.user.findFirst({
        where: {
          OR: [{ username }, { email }]
        }
      });
      if (exsitingUser) {
        throw new Error("This username/email is already taken.");
      }
      const uglyPassword = await bcrypt.hash(password, 10);
      const newUser = await client.user.create({
        data: {
          username,
          firstName,
          lastName,
          email,
          password: uglyPassword
        }
      });
      return {
        ok: true,
        user: newUser
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message
      };
    }
  }
  @Mutation((returns) => LoginOutput)
  async login(
    @Arg("input") { username, password }: LoginInput
  ): Promise<LoginOutput> {
    const user = await client.user.findFirst({ where: { username } });
    if (!user) {
      return {
        ok: false,
        error: "User not found."
      };
    }
    const passwordOk = await bcrypt.compare(password, user.password);

    if (!passwordOk) {
      return {
        ok: false,
        error: "Incorrect password."
      };
    }
    const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
    return {
      ok: true,
      token
    };
  }

  @Authorized()
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @Arg("input")
    {
      firstName,
      lastName,
      username,
      email,
      password: newPassword,
      bio,
      avatar
    }: EditProfileInput,
    @Ctx() { user }: ContextType
  ): Promise<EditProfileOutput> {
    let avatarUrl: string;
    if (avatar) {
      avatarUrl = await uploadToS3(avatar, user.id, "avatars");
      // const { filename, createReadStream } = await avatar;
      // const newFileName = `${context.user.id}-${Date.now()}-${filename}`;
      // const readStream = createReadStream();
      // const writeStream = createWriteStream(
      //   `${process.cwd()}/uploads/${newFileName}`
      // );
      // readStream.pipe(writeStream);
      // avatarUrl = `http://localhost:4000/static/${newFileName}`;
    }

    try {
      let uglyPassword;
      if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
      }
      const updatedUser = await client.user.update({
        where: { id: user.id },
        data: {
          firstName,
          lastName,
          username,
          email,
          bio,
          ...(uglyPassword && { password: uglyPassword }),
          ...(avatarUrl && { avatar: avatarUrl })
        }
      });
      if (updatedUser) {
        return {
          ok: true
        };
      } else {
        throw new Error("Can't update user");
      }
    } catch (error) {
      return {
        ok: false,
        error: error.message
      };
    }
  }

  @Authorized()
  @Mutation((returns) => FollowUserOutput)
  async followUser(
    @Args() { username }: FollowUserInput,
    @Ctx() context: ContextType
  ) {
    const ok = await client.user.findUnique({ where: { username } });
    if (!ok) {
      return {
        ok: false,
        error: "That user does not exist"
      };
    }
    await client.user.update({
      where: {
        id: context.user.id
      },
      data: {
        following: {
          connect: {
            username
          }
        }
      }
    });
    return {
      ok: true
    };
  }

  @Authorized()
  @Mutation((returns) => UnFollowUserOutput)
  async unFollowUser(
    @Args() { username }: UnFollowUserInput,
    @Ctx() context: ContextType
  ) {
    const ok = await client.user.findUnique({ where: { username } });
    if (!ok) {
      return {
        ok: false,
        error: "That user does not exist"
      };
    }
    await client.user.update({
      where: {
        id: context.user.id
      },
      data: {
        following: {
          disconnect: {
            username
          }
        }
      }
    });
    return {
      ok: true
    };
  }

  @Query((returns) => SeeFollowersOutput)
  async seeFollowers(
    @Arg("input") { username, page }: SeeFollowersInput
  ): Promise<SeeFollowersOutput> {
    const ok = await client.user.findUnique({
      where: { username },
      select: { id: true }
    });
    if (!ok) {
      return {
        ok: false,
        error: "That user does not exist"
      };
    }
    const take = 5;
    const aFollowers = await client.user
      .findUnique({
        where: {
          username
        }
      })
      .followers({
        skip: (page - 1) * take,
        take
      });
    // username을 following 하는 유저 수를 카운트 한다.
    const totalFollowers = await client.user.count({
      where: {
        following: {
          some: {
            username
          }
        }
      }
    });
    return {
      ok: true,
      followers: aFollowers,
      totalPages: Math.ceil(totalFollowers / 5)
    };
  }

  @Query((returns) => SeeFollowingOutput)
  async seeFollowing(
    @Arg("input") { username, lastId }: SeeFollowingInupt
  ): Promise<SeeFollowingOutput> {
    const ok = await client.user.findUnique({
      where: { username },
      select: { id: true }
    });
    if (!ok) {
      return {
        ok: false,
        error: "That user does not exist"
      };
    }
    const take: number = 5;
    const skip: number = lastId ? 1 : 0;

    const following = await client.user
      .findUnique({
        where: {
          username
        }
      })
      .following({
        take,
        skip,
        ...(lastId && {
          cursor: {
            id: lastId
          }
        })
      });
    return {
      ok: true,
      following
    };
  }

  @FieldResolver()
  async totalFollowing(@Root() { id }: User): Promise<number | null> {
    try {
      const totalFollowingCount = await client.user.count({
        where: {
          followers: {
            some: {
              id
            }
          }
        }
      });
      return totalFollowingCount;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @FieldResolver()
  async totalFollowers(@Root() { id }: User): Promise<number | null> {
    try {
      const totalFollowersCount = await client.user.count({
        where: {
          following: {
            some: {
              id
            }
          }
        }
      });
      return totalFollowersCount;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Authorized()
  @FieldResolver()
  async isMe(
    @Root() { id }: User,
    @Ctx() { user }: ContextType
  ): Promise<boolean> {
    try {
      if (!user) {
        return false;
      }
      return id === user.id;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Authorized()
  @FieldResolver()
  async isFollowing(
    @Root() { id }: User,
    @Ctx() { user }: ContextType
  ): Promise<boolean> {
    try {
      if (!user) {
        return false;
      }
      const exists = await client.user.count({
        where: {
          username: user.username,
          following: {
            some: {
              id
            }
          }
        }
      });
      return Boolean(exists);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @FieldResolver()
  async photos(@Root() { id }: User): Promise<Photo[] | null> {
    try {
      const photos = await client.user
        .findUnique({
          where: {
            id
          }
        })
        .photos();
      if (!photos) {
        return null;
      }
      return photos;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
