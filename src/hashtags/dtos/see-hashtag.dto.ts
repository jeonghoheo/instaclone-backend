import { IsOptional } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { HashTag } from "../entities/hashtag.entity";

@ObjectType()
export class SeeHashTagOutput extends CommonOutput {
  @Field((type) => HashTag, { nullable: true })
  @IsOptional()
  readonly hashtag?: HashTag;
}
