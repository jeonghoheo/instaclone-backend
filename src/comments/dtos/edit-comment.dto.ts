import { IsInt, IsString } from "class-validator";
import { ArgsType, Field, Int, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";

@ArgsType()
export class EditCommentInput {
  @Field((type) => Int)
  @IsInt()
  readonly id: number;

  @Field((type) => String)
  @IsString()
  readonly payload: string;
}

@ObjectType()
export class EditCommentOutput extends CommonOutput {}
