import { Field, InputType, Int, ObjectType } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";

@InputType()
@ObjectType()
export class User {
  @Field((type) => Int)
  @IsNumber()
  readonly id: number;

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

  @Field((type) => Date)
  @IsDate()
  readonly createdAt: Date;

  @Field((type) => Date)
  @IsDate()
  readonly updatedAt: Date;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly bio?: string;

  @Field((type) => GraphQLUpload, { nullable: true })
  @IsOptional()
  @IsString()
  readonly avatar?: string;
}
