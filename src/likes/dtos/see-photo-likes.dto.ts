import { IsInt, IsOptional } from "class-validator";
import { ArgsType, Field, Int, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { User } from "../../users/entities/user.entity";

@ArgsType()
export class SeePhotoLikesInput {
  @Field((type) => Int)
  @IsInt()
  readonly id: number;
}

@ObjectType()
export class SeePhotoLikesOutput extends CommonOutput {
  @Field((type) => [User], { nullable: true })
  @IsOptional()
  readonly users?: User[];
}
