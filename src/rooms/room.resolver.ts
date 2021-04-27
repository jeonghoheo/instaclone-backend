import { Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import client from "../client";
import { ContextType } from "../common/custom-auth-checker/custom-auth-checker";
import { SeeRoomsOutput } from "./dtos/see-room.dto";
import { Room } from "./entites/room.entity";

@Resolver((of) => Room)
export class RoomResolver {
  @Authorized()
  @Mutation((returns) => SeeRoomsOutput)
  async seeRooms(@Ctx() { user }: ContextType): Promise<SeeRoomsOutput> {
    try {
      const rooms = await client.room.findMany({
        where: {
          users: {
            some: {
              id: user.id
            }
          }
        }
      });
      return {
        ok: true,
        rooms
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't load Rooms"
      };
    }
  }
}
