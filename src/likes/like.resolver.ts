import { Args, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import client from "../client";
import { ContextType } from "../common/custom-auth-checker/custom-auth-checker";
import { ToggleLikeInput, ToggleLikeOutput } from "./dtos/toggleLike.dto";
import { Like } from "./entities/like.entity";

@Resolver((of) => Like)
export class LikeResolver {
  @Authorized()
  @Mutation((returns) => ToggleLikeOutput)
  async toggleLike(
    @Args() { id }: ToggleLikeInput,
    @Ctx() { user }: ContextType
  ): Promise<ToggleLikeOutput> {
    try {
      const ok = await client.photo.findUnique({
        where: {
          id
        }
      });
      if (!ok) {
        return {
          ok: false,
          error: "Photo not found."
        };
      }
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Can't add like."
      };
    }
  }
}
