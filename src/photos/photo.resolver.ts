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
import { ContextType } from "../common/custom-auth-checker/custom-auth-checker";
import { User } from "../users/entities/user.entity";
import { EditPhotoInput, EditPhotoOutput } from "./dtos/edit-photo.dto";
import {
  SearchPhotosInput,
  SearchPhotosOutput
} from "./dtos/search-photos.dto";
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
      const photo = await client.photo.create({
        data: {
          file,
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
}
