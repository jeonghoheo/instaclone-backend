import { IsInt } from "class-validator";
import { ArgsType, Field, Int, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { Room } from "../../rooms/entites/room.entity";

@ArgsType()
export class SeeRoomInput {
  @Field((type) => Int)
  @IsInt()
  readonly id: number;
}

@ObjectType()
export class SeeRoomOutput extends CommonOutput {
  @Field((type) => Room, { nullable: true })
  readonly room?: Room;
}
