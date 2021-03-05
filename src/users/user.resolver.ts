import { Arg, Mutation, Query, Resolver } from "type-graphql";
import * as bcrypt from "bcrypt";
import client from "../client";
import {
  CreateAccountInput,
  CreateAccountOutput
} from "./dtos/create-account.dto";
import { User } from "./entities/user.entity";
import { SeeProfileOutput } from "./dtos/see-profile.dto";

@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => SeeProfileOutput)
  async seeProfile(
    @Arg("username") username: string
  ): Promise<SeeProfileOutput> {
    const user = await client.user.findUnique({
      where: {
        username
      }
    });
    if (!user) {
      return {
        ok: false,
        error: "User not found."
      };
    }
    return {
      ok: true,
      user
    };
  }

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Arg("input")
    { firstName, lastName, username, email, password }: CreateAccountInput
  ): Promise<CreateAccountOutput> {
    try {
      const exsitingUser = await client.user.findFirst({
        where: {
          OR: [{ username }, { email }]
        }
      });
      if (exsitingUser) {
        throw new Error("This username/email is already taken.");
      }
      const uglyPassword = await bcrypt.hash(password, 10);
      const newUser = await client.user.create({
        data: {
          username,
          firstName,
          lastName,
          email,
          password: uglyPassword
        }
      });
      return {
        ok: true,
        user: newUser
      };
    } catch (error) {
      return {
        ok: false,
        error
      };
    }
  }
}
