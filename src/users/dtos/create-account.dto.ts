import { IsOptional, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { User } from "../entities/user.entity";

@InputType()
export class CreateAccountInput extends User {
  @Field((type) => String)
  @IsString()
  password: string;
}

@ObjectType()
export class CreateAccountOutput extends CommonOutput {
  @Field((type) => User, { nullable: true })
  @IsOptional()
  user?: User;
}
