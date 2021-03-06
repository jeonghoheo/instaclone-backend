import { AuthChecker } from "type-graphql";
import * as jwt from "jsonwebtoken";
import client from "../../client";
import { User } from "../../users/entities/user.entity";

export enum Roles {
  AUTH = "AUTH"
}
interface DecodedToken {
  id: number;
  lat: number;
}
export interface ContextType {
  headers: {
    host: string;
    connection: string;
    "content-length": string;
    "sec-ch-ua": string;
    accept: string;
    authorization: string;
    "sec-ch-ua-mobile": string;
    "user-agent": string;
    "content-type": string;
    origin: string;
    "sec-fetch-site": string;
    "sec-fetch-mode": string;
    "sec-fetch-dest": string;
    "accept-encoding": string;
    "accept-language": string;
  };
  user?: User;
  websocket?: WebSocket;
}

export const customAuthChecker: AuthChecker<ContextType> = async (
  { root, args, context, info },
  roles
) => {
  try {
    const {
      headers: { authorization }
    } = context;
    if (authorization) {
      const verifidToken = await jwt.verify(
        authorization,
        process.env.SECRET_KEY
      );
      const loginedUser = await client.user.findUnique({
        where: { id: (verifidToken as DecodedToken).id }
      });
      context.user = loginedUser;
    }
    return true; // or false if access is denied
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getUser = async (authorization: string): Promise<User | null> => {
  try {
    const verifidToken = await jwt.verify(
      authorization,
      process.env.SECRET_KEY
    );
    const loginedUser = await client.user.findUnique({
      where: { id: (verifidToken as DecodedToken).id }
    });
    if (loginedUser) {
      return loginedUser;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
