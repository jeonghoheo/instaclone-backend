import { IsEmail, IsOptional, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { GraphQLUpload } from "graphql-upload";

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

  @Field((type) => GraphQLUpload, { nullable: true })
  @IsOptional()
  @IsString()
  readonly avatar?: string;
}

@ObjectType()
export class EditProfileOutput extends CommonOutput {}
