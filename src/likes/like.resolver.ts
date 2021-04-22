import { Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import client from "../client";
import { ContextType } from "../common/custom-auth-checker/custom-auth-checker";
import {
  SeePhotoLikesInput,
  SeePhotoLikesOutput
} from "./dtos/see-photo-likes.dto";
import { ToggleLikeInput, ToggleLikeOutput } from "./dtos/toggle-like";
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
      const likeWhere = {
        photoId_userId: {
          userId: user.id,
          photoId: id
        }
      };
      const like = await client.like.findUnique({
        where: likeWhere
      });
      if (like) {
        await client.like.delete({
          where: likeWhere
        });
      } else {
        await client.like.create({
          data: {
            user: {
              connect: {
                id: user.id
              }
            },
            photo: {
              connect: {
                id
              }
            }
          }
        });
      }
      return {
        ok: true
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Can't add like."
      };
    }
  }

  @Query((returns) => SeePhotoLikesOutput)
  async seePhotoLikes(
    @Args() { id }: SeePhotoLikesInput
  ): Promise<SeePhotoLikesOutput> {
    try {
      const likes = await client.like.findMany({
        where: {
          photoId: id
        },
        select: {
          user: true
        }
      });
      return {
        ok: true,
        users: likes.map((like) => like.user)
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Can't load likes"
      };
    }
  }
}
