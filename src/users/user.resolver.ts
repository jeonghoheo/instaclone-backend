import { Arg, Mutation, Query, Resolver } from "type-graphql";
import client from "../client";
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
  async createAccount(
    @Arg("input")
    { firstName, lastName, username, email, password }: CreateAccountInput
  ): Promise<CreateAccountOutput> {
    const exsitingUser = await client.user.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    });
    console.log(exsitingUser);
    return {
      ok: true
    };
  }
}
