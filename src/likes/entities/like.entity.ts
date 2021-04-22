import { IsInt } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Common } from "../../common/common.dto";
import { Photo } from "../../photos/entities/photo.entity";
import { User } from "../../users/entities/user.entity";

@InputType()
@ObjectType()
export class Like extends Common {
  @Field((type) => User)
  readonly user: User;

  @Field((type) => Photo)
  readonly photo: Photo;

  @Field((type) => Int)
  @IsInt()
  readonly photoId: number;

  @Field((type) => Int)
  @IsInt()
  readonly userId: number;
}
