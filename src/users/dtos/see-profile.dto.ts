import { IsOptional } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { User } from "../entities/user.entity";

@ObjectType()
export class SeeProfileOutput extends CommonOutput {
  @Field((type) => User, { nullable: true })
  @IsOptional()
  readonly user?: User;
}
