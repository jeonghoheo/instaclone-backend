import { AuthChecker } from "type-graphql";
import * as jwt from "jsonwebtoken";
import client from "../../client";
import { User } from "../../users/entities/user.entity";

interface DecodedToken {
  id: number;
  lat: number;
}

export interface ContextType {
  authorization: string;
  user?: User;
}

export const customAuthChecker: AuthChecker<ContextType> = async (
  { root, args, context, info },
  roles
) => {
  try {
    const { authorization } = context;
    if (authorization) {
      const verifidToken = await jwt.verify(
        authorization,
        process.env.SECRET_KEY
      );
      const loginedUser = await client.user.findUnique({
        where: { id: (verifidToken as DecodedToken).id }
      });
      context.user = loginedUser;
      return true; // or false if access is denied
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
