import { Field, InputType, ObjectType } from "type-graphql";
import { IsEmail, IsOptional, IsString } from "class-validator";

@InputType()
@ObjectType()
export class User {
  @Field((type) => String)
  @IsString()
  readonly id: string;

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
  readonly createdAt: string;

  @Field((type) => String)
  @IsString()
  readonly updatedAt: string;
}
