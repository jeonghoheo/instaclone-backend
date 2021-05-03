import { IsBoolean, IsNumber, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Common } from "../../common/common.dto";
import { Room } from "../../rooms/entites/room.entity";
import { User } from "../../users/entities/user.entity";

@InputType()
@ObjectType()
export class Message extends Common {
  @Field((type) => String)
  @IsString()
  readonly payload: string;

  @Field((type) => User)
  readonly user: User;

  @Field((type) => Room)
  readonly room: Room;

  @Field((type) => Boolean)
  @IsBoolean()
  readonly read: boolean;
}
