import { createWriteStream } from "fs";
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver
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

@Resolver((of) => User)
export class UserResolver {
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
    @Ctx() context: ContextType
  ): Promise<EditProfileOutput> {
    let avatarUrl: string;
    if (avatar) {
      const { filename, createReadStream } = await avatar;
      const newFileName = `${context.user.id}-${Date.now()}-${filename}`;
      const readStream = createReadStream();
      const writeStream = createWriteStream(
        `${process.cwd()}/uploads/${newFileName}`
      );
      readStream.pipe(writeStream);
      avatarUrl = `http://localhost:4000/static/${newFileName}`;
    }

    try {
      let uglyPassword;
      if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
      }
      const updatedUser = await client.user.update({
        where: { id: context.user.id },
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
}
