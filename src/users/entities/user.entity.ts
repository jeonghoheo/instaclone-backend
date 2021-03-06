import { Field, InputType, Int, ObjectType, Root } from "type-graphql";
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { Photo } from "../../photos/entities/photo.entity";

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

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @Field((type) => [Photo], { nullable: true })
  @IsOptional()
  readonly photos?: Photo[];

  @Field((type) => [User], { nullable: true })
  @IsOptional()
  readonly following?: User[];

  @Field((type) => [User], { nullable: true })
  @IsOptional()
  readonly followers?: User[];

  @Field((type) => Number)
  @IsOptional()
  @IsNumber()
  totalFollowing?: number;

  @Field((type) => Number)
  @IsOptional()
  @IsNumber()
  totalFollowers?: number;

  @Field((type) => Boolean)
  @IsOptional()
  @IsBoolean()
  isMe?: boolean;

  @Field((type) => Boolean)
  @IsOptional()
  @IsBoolean()
  isFollowing?: boolean;
}
