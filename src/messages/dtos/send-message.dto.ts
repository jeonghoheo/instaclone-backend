import { IsNumber, IsString } from "class-validator";
import { ArgsType, Field, Int, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { Room } from "../../rooms/entites/room.entity";

@ArgsType()
export class SendMessageInput {
  @Field((type) => String)
  @IsString()
  readonly payload: string;

  @Field((type) => Int, { nullable: true })
  @IsNumber()
  readonly roomId?: number;

  @Field((type) => Int, { nullable: true })
  @IsNumber()
  readonly userId?: number;
}

@ObjectType()
export class SendMessageOutput extends CommonOutput {}
