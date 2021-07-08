import { HashTag } from ".prisma/client";
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
import client from "../client";
import {
  ContextType,
  Roles
} from "../common/custom-auth-checker/custom-auth-checker";
import { uploadToS3 } from "../shared/shared.utils";
import { User } from "../users/entities/user.entity";
import { DeletePhotoInput, DeletePhotoOutput } from "./dtos/delete-photo.dto";
import { EditPhotoInput, EditPhotoOutput } from "./dtos/edit-photo.dto";
import {
  SearchPhotosInput,
  SearchPhotosOutput
} from "./dtos/search-photos.dto";
import { SeeFeedOutput } from "./dtos/see-feed.dto";
import {
  SeePhotoCommentsInput,
  SeePhotoCommentsOutput
} from "./dtos/see-photo-comments.dto";
import { SeePhotoOutput } from "./dtos/see-photo.dto";
import { UploadPhotoInput, UploadPhotoOutput } from "./dtos/upload-photo.dto";
import { Photo } from "./entities/photo.entity";
import { processHashtags } from "./photos.utils";
@Resolver((of) => Photo)
export class PhotoResovler {
  @Authorized()
  @Mutation((returns) => UploadPhotoOutput)
  async uploadPhoto(
    @Arg("input") { file, caption }: UploadPhotoInput,
    @Ctx() { user }: ContextType
  ): Promise<UploadPhotoOutput> {
    try {
      let hashtagObj = [];
      if (caption) {
        hashtagObj = processHashtags(caption);
      }

      const fileUrl = await uploadToS3(file, user.id, "uploads");

      const photo = await client.photo.create({
        data: {
          file: fileUrl,
          caption,
          user: {
            connect: {
              id: user.id
            }
          },
          ...(hashtagObj.length > 0 && {
            hashtags: { connectOrCreate: hashtagObj }
          })
        }
      });
      return {
        ok: true,
        photo
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Can't upload photo"
      };
    }
  }

  @Query((returns) => SeePhotoOutput)
  async seePhoto(@Arg("id") id: number): Promise<SeePhotoOutput> {
    try {
      const photo = await client.photo.findUnique({
        where: {
          id
        }
      });
      if (!photo) {
        return {
          ok: false,
          error: "Photo not found."
        };
      }
      return {
        ok: true,
        photo
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Can't find the Photo"
      };
    }
  }

  @Query((returns) => SearchPhotosOutput)
  async searchPhotos(
    @Args() { keyword }: SearchPhotosInput
  ): Promise<SearchPhotosOutput> {
    try {
      const photos = await client.photo.findMany({
        where: {
          caption: {
            startsWith: keyword
          }
        }
      });
      if (!photos) {
        return {
          ok: false,
          error: "Photos not found."
        };
      }
      return {
        ok: true,
        photos
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't not find Photos."
      };
    }
  }

  @Authorized()
  @Mutation((returns) => EditPhotoOutput)
  async editPhoto(
    @Arg("input") { id, caption }: EditPhotoInput,
    @Ctx() { user }: ContextType
  ): Promise<EditPhotoOutput> {
    try {
      const oldphoto = await client.photo.findFirst({
        where: {
          id,
          userId: user.id
        },
        include: {
          hashtags: {
            select: {
              hashtag: true
            }
          }
        }
      });
      if (!oldphoto) {
        return {
          ok: false,
          error: "Can't update this photo"
        };
      }
      await client.photo.update({
        where: {
          id
        },
        data: {
          caption,
          hashtags: {
            disconnect: oldphoto.hashtags,
            connectOrCreate: processHashtags(caption)
          }
        }
      });

      return {
        ok: true
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't update photo"
      };
    }
  }

  @Authorized()
  @Query((returns) => SeeFeedOutput)
  async seeFeed(@Ctx() { user }: ContextType): Promise<SeeFeedOutput> {
    try {
      const photos = await client.photo.findMany({
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    id: user.id
                  }
                }
              }
            },
            {
              userId: user.id
            }
          ]
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      if (!photos) {
        return {
          ok: false,
          error: "Feeds not found."
        };
      }
      return {
        ok: true,
        photos
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't get feeds"
      };
    }
  }

  @Query((returns) => SeePhotoCommentsOutput)
  async seePhotoComments(@Args() { id }: SeePhotoCommentsInput) {
    try {
      const comments = await client.comment.findMany({
        where: {
          photoId: id
        },
        include: {
          user: true,
          photo: true
        },
        orderBy: {
          createdAt: "asc"
        }
      });
      if (!comments) {
        return {
          ok: false,
          error: "Comments not found."
        };
      }
      return {
        ok: true,
        comments
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Can't see comments"
      };
    }
  }

  @Authorized([Roles.AUTH])
  @Mutation((returns) => DeletePhotoOutput)
  async deletePhoto(
    @Args() { id }: DeletePhotoInput,
    @Ctx() { user }: ContextType
  ): Promise<DeletePhotoOutput> {
    try {
      const photo = await client.photo.findUnique({
        where: {
          id
        },
        select: {
          userId: true
        }
      });
      if (!photo) {
        return {
          ok: false,
          error: "Photo not found."
        };
      } else if (photo.userId !== user.id) {
        return {
          ok: false,
          error: "Not authorized."
        };
      } else {
        await client.like.deleteMany({
          where: {
            photoId: id
          }
        });
        await client.comment.deleteMany({
          where: {
            photoId: id
          }
        });
        await client.photo.delete({
          where: {
            id
          }
        });
        return {
          ok: true
        };
      }
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Can't delete photo"
      };
    }
  }

  @FieldResolver()
  async user(@Root() { userId }: Photo): Promise<User> {
    try {
      const user = await client.user.findUnique({
        where: {
          id: userId
        }
      });
      if (!user) {
        throw new Error("User not found.");
      }
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @FieldResolver()
  async hashtags(@Root() { id }: Photo): Promise<HashTag[]> {
    try {
      const hashtags = await client.hashTag.findMany({
        where: {
          photos: {
            some: {
              id
            }
          }
        }
      });
      if (!hashtags) {
        throw new Error("Hashtags not found.");
      }
      return hashtags;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @FieldResolver()
  async likes(@Root() { id }: Photo): Promise<number | null> {
    try {
      const likes = await client.like.count({ where: { photoId: id } });
      if (!likes) {
        throw new Error("Likes not found.");
      }
      return likes;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @FieldResolver()
  async comments(@Root() { id }: Photo): Promise<number | null> {
    try {
      const comments = await client.comment.count({ where: { photoId: id } });
      if (!comments) {
        throw new Error("comments not found.");
      }
      return comments;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Authorized()
  @FieldResolver()
  isMine(
    @Root() { userId }: Photo,
    @Ctx() { user }: ContextType
  ): boolean | null {
    if (!userId) {
      return false;
    }
    return userId === user.id;
  }

  @Authorized()
  @FieldResolver()
  async isLiked(
    @Root() { id }: Photo,
    @Ctx() { user }: ContextType
  ): Promise<boolean> {
    if (!user) {
      return false;
    }
    try {
      const ok = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: user.id
          }
        },
        select: {
          id: true
        }
      });
      if (ok) {
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
