import { IsEmail, IsOptional, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { User } from "../entities/user.entity";

@InputType()
export class CreateAccountInput {
  @Field((type) => String)
  @IsString()
  readonly firstName: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @Field((type) => String)
  @IsString()
  readonly username: string;

  @Field((type) => String)
  @IsEmail()
  readonly email: string;

  @Field((type) => String)
  @IsString()
  readonly password: string;
}

@ObjectType()
export class CreateAccountOutput extends CommonOutput {
  @Field((type) => User, { nullable: true })
  @IsOptional()
  readonly user?: User;
}
