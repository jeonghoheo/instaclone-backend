import { IsInt } from "class-validator";
import { ArgsType, Field, Int, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";

@ArgsType()
export class DeletePhotoInput {
  @Field((type) => Int)
  @IsInt()
  readonly id: number;
}

@ObjectType()
export class DeletePhotoOutput extends CommonOutput {}
