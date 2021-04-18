import { IsOptional } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { Photo } from "../entities/photo.entity";

@ObjectType()
export class SeePhotoOutput extends CommonOutput {
  @Field((type) => Photo, { nullable: true })
  @IsOptional()
  readonly photo?: Photo;
}
