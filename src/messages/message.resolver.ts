import { Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import client from "../client";
import { ContextType } from "../common/custom-auth-checker/custom-auth-checker";
import { SendMessageInput, SendMessageOutput } from "./dtos/send-message.dto";
import { Message } from "./entites/message.entity";

@Resolver((of) => Message)
export class RoomResolver {
  @Authorized()
  @Mutation((returns) => SendMessageOutput)
  async sendMessage(
    @Args() { payload, roomId, userId }: SendMessageInput,
    @Ctx() { user }: ContextType
  ): Promise<SendMessageOutput> {
    try {
      let room = null;
      if (userId) {
        const user = await client.user.findUnique({
          where: {
            id: userId
          },
          select: {
            id: true
          }
        });
        if (!user) {
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
        await client.message.create({
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
        return {
          ok: true
        };
      }
    } catch (error) {
      return {
        ok: false,
        error: "Can't send Message"
      };
    }
  }
}
