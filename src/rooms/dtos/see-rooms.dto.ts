import { Field, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { Room } from "../../rooms/entites/room.entity";

@ObjectType()
export class SeeRoomsOutput extends CommonOutput {
  @Field((type) => [Room], { nullable: true })
  readonly rooms?: Room[];
}
