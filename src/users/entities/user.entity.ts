import { Field, ObjectType } from "type-graphql";
import { IsEmail, IsOptional, IsString } from "class-validator";

@ObjectType()
export class User {
  @Field((type) => String)
  @IsString()
  id: string;

  @Field((type) => String)
  @IsString()
  firstName: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field((type) => String)
  @IsString()
  username: string;

  @Field((type) => String)
  @IsEmail()
  email: string;

  @Field((type) => String)
  @IsString()
  createdAt: string;

  @Field((type) => String)
  @IsString()
  updatedAt: string;
}
