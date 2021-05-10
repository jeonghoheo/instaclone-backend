import {
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Query,
  Resolver,
  Root,
  Subscription
} from "type-graphql";
import client from "../client";
import { ContextType } from "../common/custom-auth-checker/custom-auth-checker";
import { TOPICS } from "../constants";
import { Message } from "../messages/entites/message.entity";
import { User } from "../users/entities/user.entity";
import { RoomUpdatesInput, RoomUpdatesOutput } from "./dtos/room-updates.dto";
import { SeeRoomInput, SeeRoomOutput } from "./dtos/see-room.dto";
import { SeeRoomsOutput } from "./dtos/see-rooms.dto";
import { Room } from "./entites/room.entity";

@Resolver((of) => Room)
export class RoomResolver {
  @Authorized()
  @Query((returns) => SeeRoomsOutput)
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

  @Authorized()
  @Query((returns) => SeeRoomOutput)
  async seeRoom(
    @Args() { id }: SeeRoomInput,
    @Ctx() { user }: ContextType
  ): Promise<SeeRoomOutput> {
    try {
      const room = await client.room.findFirst({
        where: {
          id,
          users: {
            some: {
              id: user.id
            }
          }
        }
      });
      return {
        ok: true,
        room
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't see Room"
      };
    }
  }

  @Subscription((returns) => RoomUpdatesOutput, {
    topics: TOPICS.NEW_MESSAGE,
    filter: async ({
      payload: { message },
      args: { id },
      context: { user, websocket }
    }) => {
      const wst: WebSocket = websocket;
      if (message.roomId === id) {
        const room = await client.room.findFirst({
          where: {
            id,
            users: {
              some: {
                id: user.id
              }
            }
          },
          select: {
            id: true
          }
        });
        if (!room) {
          wst.close();
          return false;
        }
      }
      return message.roomId === id;
    }
  })
  roomUpdates(
    @Root() payload: RoomUpdatesOutput,
    @Args() { id }: RoomUpdatesInput
  ): RoomUpdatesOutput {
    return payload;
  }

  @Authorized()
  @FieldResolver()
  async users(
    @Root() { id }: Room,
    @Ctx() context: ContextType
  ): Promise<User[] | null> {
    try {
      const users = await client.room
        .findUnique({
          where: {
            id
          }
        })
        .users();
      return users;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Authorized()
  @FieldResolver()
  async messages(@Root() { id }: Room): Promise<Message[] | null> {
    try {
      const messages = await client.message.findMany({
        where: {
          roomId: id
        },
        include: {
          user: true,
          room: true
        }
      });
      return messages;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Authorized()
  @FieldResolver()
  async unreadTotal(
    @Root() { id }: Room,
    @Ctx() { user }: ContextType
  ): Promise<number> {
    try {
      if (!user) {
        return 0;
      }
      return await client.message.count({
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: user.id
            }
          }
        }
      });
    } catch (error) {
      return 0;
    }
  }
}
