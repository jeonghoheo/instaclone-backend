import { IsNumber, IsOptional, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Comment } from "../../comments/entities/comment.entity";
import { Common } from "../../common/common.dto";
import { HashTag } from "../../hashtags/entities/hashtag.entity";
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

  @Field((type) => Number, { defaultValue: 0 })
  @IsNumber()
  readonly likes?: number;

  @Field((type) => Number, { nullable: true })
  @IsNumber()
  readonly commentNumber?: number;

  @Field((type) => [Comment], { nullable: true })
  @IsOptional()
  readonly comments?: Comment[];

  @Field((type) => Boolean, { nullable: true })
  @IsOptional()
  readonly isMine?: boolean;

  @Field((type) => Boolean, { defaultValue: false })
  @IsOptional()
  readonly isLiked?: boolean;

  @Field((type) => [HashTag], { nullable: true })
  @IsOptional()
  readonly hashtags?: HashTag[];
}
