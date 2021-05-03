import { IsNumber, IsOptional } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Common } from "../../common/common.dto";
import { Message } from "../../messages/entites/message.entity";
import { User } from "../../users/entities/user.entity";

@InputType()
@ObjectType()
export class Room extends Common {
  @Field((type) => [User], { nullable: true })
  readonly users?: User[];

  @Field((type) => [Message], { nullable: true })
  readonly messages?: Message[];

  @Field((type) => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  readonly unreadTotal?: number;
}
