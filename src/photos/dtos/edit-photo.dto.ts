import { IsNumber, IsOptional, IsString } from "class-validator";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { Photo } from "../entities/photo.entity";

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
