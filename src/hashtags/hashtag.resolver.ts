import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import client from "../client";
import { ContextType } from "../common/custom-auth-checker/custom-auth-checker";
import { Photo } from "../photos/entities/photo.entity";
import { SeeHashTagOutput } from "./dtos/see-hashtag.dto";
import { HashTag } from "./entities/hashtag.entity";

@Resolver((of) => HashTag)
export class HashtagResolver {
  @Query((returns) => SeeHashTagOutput)
  async seeHashtag(@Arg("hashtag") hashtag: string): Promise<SeeHashTagOutput> {
    try {
      const foundedHashtag = await client.hashTag.findUnique({
        where: {
          hashtag
        }
      });
      if (!foundedHashtag) {
        return {
          ok: false,
          error: "Hashtag not found."
        };
      }
      return {
        ok: true,
        hashtag: foundedHashtag
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "HashTag not found."
      };
    }
  }

  @FieldResolver()
  async photos(
    @Root() { id }: HashTag,
    @Arg("page") page: number,
    @Ctx() context: ContextType
  ): Promise<Photo[] | null> {
    try {
      const foundedPhotos = await client.hashTag
        .findUnique({
          where: {
            id
          }
        })
        .photos();

      if (!foundedPhotos) {
        throw new Error("photos not found.");
      }
      return foundedPhotos;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @FieldResolver()
  async totalPhotos(@Root() { id }: HashTag): Promise<number | null> {
    try {
      const countedPhotos = await client.photo.count({
        where: {
          hashtags: {
            some: {
              id
            }
          }
        }
      });
      if (!countedPhotos) {
        throw new Error("totalPhotos not found.");
      }
      return countedPhotos;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
