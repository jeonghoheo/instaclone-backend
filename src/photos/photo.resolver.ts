import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
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
  ) {
    if (caption) {
      // parse caption
      // get or create HashTags
    }
    // save the photo WITH the parsed hashtags
    // add the photo to the hashtags
  }
}
