import { IsIn, IsInt, IsOptional, IsString } from "class-validator";
import { ArgsType, Field, Int, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";

@ArgsType()
export class CreateCommentInput {
  @Field((type) => Int)
  @IsInt()
  readonly photoId: number;

  @Field((type) => String)
  @IsString()
  readonly payload: string;
}

@ObjectType()
export class CreateCommentOutput extends CommonOutput {
  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  readonly id?: number;
}
