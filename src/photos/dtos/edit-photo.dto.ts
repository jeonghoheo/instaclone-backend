import { IsNumber, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";

@InputType()
@ObjectType()
export class EditPhotoInput {
  @Field((type) => Number)
  @IsNumber()
  readonly id: number;

  @Field((type) => String)
  @IsString()
  readonly caption: string;
}

@ObjectType()
export class EditPhotoOutput extends CommonOutput {}
