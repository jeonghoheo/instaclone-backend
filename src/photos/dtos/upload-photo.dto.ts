import { IsOptional, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { Photo } from "../entities/photo.entity";
import { FileUpload, GraphQLUpload as Upload } from "graphql-upload";

@InputType()
export class UploadPhotoInput {
  @Field((type) => Upload)
  readonly file: FileUpload;

  @Field((type) => String)
  @IsOptional()
  @IsString()
  readonly caption?: string;
}

@ObjectType()
export class UploadPhotoOutput extends CommonOutput {
  @Field((type) => Photo, { nullable: true })
  readonly photo?: Photo;
}
