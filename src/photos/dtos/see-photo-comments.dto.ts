import { IsInt, IsOptional } from "class-validator";
import { ArgsType, Field, Int, ObjectType } from "type-graphql";
import { Comment } from "../../comments/entities/comment.entity";
import { CommonOutput } from "../../common/common.dto";

@ArgsType()
export class SeePhotoCommentsInput {
  @Field((type) => Int)
  @IsInt()
  readonly id: number;
}

@ObjectType()
export class SeePhotoCommentsOutput extends CommonOutput {
  @Field((type) => [Comment], { nullable: true })
  @IsOptional()
  readonly comments?: Comment[];
}
