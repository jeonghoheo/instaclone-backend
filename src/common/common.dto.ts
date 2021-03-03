import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Field, ObjectType } from "type-graphql";

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
