import { IsInt, IsOptional } from "class-validator";
import { ArgsType, Field, Int, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { Like } from "../entities/like.entity";

@ArgsType()
export class ToggleLikeInput {
  @Field((type) => Int)
  @IsInt()
  readonly id: number;
}

@ObjectType()
export class ToggleLikeOutput extends CommonOutput {
  @Field((type) => Like, { nullable: true })
  @IsOptional()
  readonly like?: Like;
}
