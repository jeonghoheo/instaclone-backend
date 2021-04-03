import { IsInt, IsOptional, IsString } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { User } from "../entities/user.entity";

@InputType()
export class SeeFollowersInput {
  @Field((type) => String)
  @IsString()
  readonly username: string;

  @Field((type) => Int)
  @IsInt()
  readonly page: number;
}

@ObjectType()
export class SeeFollowersOutput extends CommonOutput {
  @Field((type) => [User], { nullable: true })
  @IsOptional()
  readonly followers?: User[];
}
