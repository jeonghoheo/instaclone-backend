import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import client from "../client";
import { ContextType } from "../common/custom-auth-checker/custom-auth-checker";
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
      const newPhoto = await client.photo.create({
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
      console.log(newPhoto);
      return {
        ok: true
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't upload photo"
      };
    }
  }
}
