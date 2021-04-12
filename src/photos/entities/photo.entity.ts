import { IsOptional, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Common } from "../../common/common.dto";
import { User } from "../../users/entities/user.entity";

@InputType()
@ObjectType()
export class Photo extends Common {
  @Field((type) => User)
  readonly user: User;

  @Field((type) => String)
  @IsString()
  readonly file: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly caption?: string;

  @Field((type) => [HashTag], { nullable: true })
  @IsOptional()
  readonly hashtag?: HashTag[];
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
