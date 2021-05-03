import { IsInt } from "class-validator";
import { ArgsType, Field, Int, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";

@ArgsType()
export class ReadMessageInput {
  @Field((type) => Int)
  @IsInt()
  readonly id: number;
}

@ObjectType()
export class ReadMessageOutput extends CommonOutput {}
