import { Arg, Mutation, Query, Resolver } from "type-graphql";
import {
  CreateAccountInput,
  CreateAccountOutput
} from "./dtos/create-account.dto";
import { User } from "./entities/user.entity";

@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => User)
  seeProfile(@Arg("username") username: string) {
    return true;
  }

  @Mutation((returns) => CreateAccountOutput)
  createAccount(
    @Arg("input")
    { id, firstName, lastName, username, email, password }: CreateAccountInput
  ): CreateAccountOutput {
    console.log(id);
    return {
      ok: true
    };
  }
}
