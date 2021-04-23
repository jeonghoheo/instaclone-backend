import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql";
import client from "../client";
import { ContextType } from "../common/custom-auth-checker/custom-auth-checker";
import {
  CreateCommentInput,
  CreateCommentOutput
} from "./dtos/create-comment.dto";

import { Comment } from "./entities/comment.entity";

@Resolver((of) => Comment)
export class CommentResolver {
  @Authorized()
  @Mutation((returns) => CreateCommentOutput)
  async createComment(
    @Args() { photoId, payload }: CreateCommentInput,
    @Ctx() { user }: ContextType
  ): Promise<CreateCommentOutput> {
    try {
      const ok = await client.photo.findUnique({
        where: {
          id: photoId
        },
        select: {
          id: true
        }
      });
      if (!ok) {
        return {
          ok: false,
          error: "Photo not found."
        };
      }
      await client.comment.create({
        data: {
          payload,
          photo: {
            connect: {
              id: photoId
            }
          },
          user: {
            connect: {
              id: user.id
            }
          }
        }
      });
      return {
        ok: true
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Can't create comment"
      };
    }
  }

  @Authorized()
  @FieldResolver()
  isMine(
    @Root() { userId }: Comment,
    @Ctx() context: ContextType
  ): boolean | null {
    if (!context.user) {
      return false;
    }

    return userId === context.user.id;
  }
}
