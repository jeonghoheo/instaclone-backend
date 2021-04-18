import { IsNumber, IsOptional, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Common } from "../../common/common.dto";
import { User } from "../../users/entities/user.entity";

@InputType()
@ObjectType()
export class Photo extends Common {
  @Field((type) => User, { nullable: true })
  @IsOptional()
  readonly user?: User;

  @Field((type) => Number)
  @IsNumber()
  readonly userId: number;

  @Field((type) => String)
  @IsString()
  readonly file: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly caption?: string;

  @Field((type) => [HashTag], { nullable: true })
  @IsOptional()
  readonly hashtags?: HashTag[];
}

@InputType()
@ObjectType()
class HashTag extends Common {
  @Field((type) => String)
  @IsString()
  readonly hashtag: String;

  @Field((type) => [Photo], { nullable: true })
  @IsOptional()
  readonly photos?: Photo[];
}
