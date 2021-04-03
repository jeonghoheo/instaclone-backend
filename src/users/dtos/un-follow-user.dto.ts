import { IsString } from "class-validator";
import { ArgsType, Field, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";

@ArgsType()
export class UnFollowUserInput {
  @Field((type) => String)
  @IsString()
  readonly username: string;
}

@ObjectType()
export class UnFollowUserOutput extends CommonOutput {}
