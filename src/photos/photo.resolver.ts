import { HashTag } from ".prisma/client";
import {
  Arg,
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
import { SeeProfileOutput } from "../users/dtos/see-profile.dto";
import { User } from "../users/entities/user.entity";
import { SeePhotoOutput } from "./dtos/see-photo.dto";
import { UploadPhotoInput, UploadPhotoOutput } from "./dtos/upload-photo.dto";
import { Photo } from "./entities/photo.entity";

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
        const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g);
        hashtagObj = hashtags.map((hashtag) => ({
          where: { hashtag },
          create: { hashtag }
        }));
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
