import { IsEmail, IsOptional, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";

@InputType()
export class EditProfileInput {
  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly username?: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly password?: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly bio?: string;
}

@ObjectType()
export class EditProfileOutput extends CommonOutput {}
