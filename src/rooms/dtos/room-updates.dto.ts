import { IsNumber } from "class-validator";
import { ArgsType, Field, Int, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { Message } from "../../messages/entites/message.entity";

@ArgsType()
export class RoomUpdatesInput {
  @Field((type) => Int)
  @IsNumber()
  readonly id: number;
}

@ObjectType()
export class RoomUpdatesOutput extends CommonOutput {
  @Field((type) => Message, { nullable: true })
  readonly message?: Message;
}
