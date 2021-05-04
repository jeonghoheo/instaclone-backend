import {
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  Root
} from "type-graphql";
import client from "../client";
import { ContextType } from "../common/custom-auth-checker/custom-auth-checker";
import { TOPICS } from "../constants";
import { RoomUpdatesOutput } from "../rooms/dtos/room-updates.dto";
import { Room } from "../rooms/entites/room.entity";
import { User } from "../users/entities/user.entity";
import { ReadMessageInput, ReadMessageOutput } from "./dtos/read-message.dto";
import { SendMessageInput, SendMessageOutput } from "./dtos/send-message.dto";
import { Message } from "./entites/message.entity";

@Resolver((of) => Message)
export class MessageResolver {
  @Authorized()
  @Mutation((returns) => SendMessageOutput)
  async sendMessage(
    @Args() { payload, roomId, userId }: SendMessageInput,
    @Ctx() { user }: ContextType,
    @PubSub(TOPICS.NEW_MESSAGE)
    publish: Publisher<RoomUpdatesOutput>
  ): Promise<SendMessageOutput> {
    try {
      let room = null;
      if (userId) {
        const isUser = await client.user.findUnique({
          where: {
            id: userId
          },
          select: {
            id: true
          }
        });
        if (!isUser) {
          return {
            ok: false,
            error: "This user does not exist."
          };
        }

        room = await client.room.create({
          data: {
            users: {
              connect: [
                {
                  id: userId
                },
                {
                  id: user.id
                }
              ]
            }
          }
        });
      } else if (roomId) {
        room = await client.room.findUnique({
          where: {
            id: roomId
          },
          select: {
            id: true
          }
        });
        if (!room) {
          return {
            ok: false,
            error: "Room not found."
          };
        }
      }
      const message = await client.message.create({
        data: {
          payload,
          room: {
            connect: {
              id: room.id
            }
          },
          user: {
            connect: {
              id: user.id
            }
          }
        }
      });

      await publish({
        ok: true,
        message
      });
      return {
        ok: true
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't send Message"
      };
    }
  }

  @Authorized()
  @Mutation((returns) => ReadMessageOutput)
  async readMessage(
    @Args() { id }: ReadMessageInput,
    @Ctx() { user }: ContextType
  ): Promise<ReadMessageOutput> {
    try {
      const message = await client.message.findFirst({
        where: {
          id,
          userId: {
            not: user.id
          },
          room: {
            users: {
              some: {
                id: user.id
              }
            }
          }
        },
        select: {
          id: true
        }
      });
      if (!message) {
        return {
          ok: false,
          error: "Message not found."
        };
      }
      await client.message.update({
        where: {
          id
        },
        data: {
          read: true
        }
      });
      return {
        ok: true
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't read message."
      };
    }
  }

  @FieldResolver()
  async user(@Root() { id }: Message): Promise<User | null> {
    try {
      const { user } = await client.message.findUnique({
        where: {
          id
        },
        select: {
          user: true
        }
      });
      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  @FieldResolver()
  async room(@Root() { id }: Message): Promise<Room | null> {
    try {
      const { room } = await client.message.findUnique({
        where: {
          id
        },
        select: {
          room: true
        }
      });
      if (room) {
        return room;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
}
