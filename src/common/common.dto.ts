import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Common {
  @Field((type) => Int)
  @IsNumber()
  readonly id: number;

  @Field((type) => Date)
  @IsDate()
  readonly createdAt: Date;

  @Field((type) => Date)
  @IsDate()
  readonly updatedAt: Date;
}

@ObjectType()
export class CommonOutput {
  @Field((type) => Boolean)
  @IsBoolean()
  ok: boolean;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  error?: string;
}
