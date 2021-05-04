import { Field, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { Message } from "../../messages/entites/message.entity";

@ObjectType()
export class RoomUpdatesOutput extends CommonOutput {
  @Field((type) => Message, { nullable: true })
  readonly message?: Message;
}
