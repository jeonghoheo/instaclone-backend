import { IsOptional, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";

@InputType()
export class LoginInput {
  @Field((type) => String)
  @IsString()
  readonly username: string;

  @Field((type) => String)
  @IsString()
  readonly password: string;
}

@ObjectType()
export class LoginOutput extends CommonOutput {
  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly token?: string;
}
