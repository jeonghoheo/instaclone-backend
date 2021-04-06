import { IsNumber, IsOptional, IsString } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { User } from "../entities/user.entity";

@InputType()
export class SeeFollowingInupt {
  @Field((type) => String)
  @IsString()
  readonly username: string;

  @Field((type) => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  readonly lastId?: number;
}

@ObjectType()
export class SeeFollowingOutput extends CommonOutput {
  @Field((type) => [User], { nullable: true })
  @IsOptional()
  readonly following?: User[];
}
