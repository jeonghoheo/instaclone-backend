import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Common } from "../../common/common.dto";
import { Photo } from "../../photos/entities/photo.entity";
import { User } from "../../users/entities/user.entity";

@InputType()
@ObjectType()
export class Comment extends Common {
  @Field((type) => Int)
  @IsInt()
  readonly id: number;

  @Field((type) => User)
  readonly user: User;

  @Field((type) => Photo)
  readonly photo: Photo;

  @Field((type) => String)
  @IsString()
  readonly payload: string;

  @Field((type) => Boolean, { nullable: true })
  @IsOptional()
  readonly isMine?: boolean;
}
