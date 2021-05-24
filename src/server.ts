require("dotenv").config();
import "reflect-metadata";
import http from "http";
import cors from "cors";
import express from "express";
import expressPlayground from "graphql-playground-middleware-express";
import { ApolloServer } from "apollo-server-express";
import { graphqlHTTP } from "express-graphql";
import { graphqlUploadExpress } from "graphql-upload";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { makeExecutableSchema } from "graphql-tools";
import { UserResolver } from "./users/user.resolver";
import {
  customAuthChecker,
  getUser
} from "./common/custom-auth-checker/custom-auth-checker";
import { PhotoResovler } from "./photos/photo.resolver";
import { HashtagResolver } from "./hashtags/hashtag.resolver";
import { LikeResolver } from "./likes/like.resolver";
import { CommentResolver } from "./comments/comment.resolver";
import { RoomResolver } from "./rooms/room.resolver";
import { MessageResolver } from "./messages/message.resolver";
import { pubSub } from "./pubsub/pubsub";

const main = async () => {
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [
      UserResolver,
      PhotoResovler,
      HashtagResolver,
      LikeResolver,
      CommentResolver,
      RoomResolver,
      MessageResolver
    ],
    emitSchemaFile: true,
    validate: true,
    authChecker: customAuthChecker,
    pubSub
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    uploads: false,
    context: ({ req, connection }) => {
      if (req) {
        const context = {
          authorization: req.headers.authorization
        };
        return context;
      } else {
        const { context } = connection;
        return {
          user: context.user,
          websocket: context.websocket
        };
      }
    },
    subscriptions: {
      onConnect: async (
        { authorization }: { authorization?: string },
        websocket
      ) => {
        if (!authorization) {
          throw new Error("You can't listen.");
        }
        const user = await getUser(authorization);
        if (!user) {
          throw new Error("Login is required.");
        }
        return {
          user,
          websocket
        };
      }
    }
  });
  await server.start();
  const app = express();

  app.use(cors());
  app.get(
    "/playground",
    expressPlayground({
      endpoint: "/graphql",
      subscriptionEndpoint: "/graphql"
    })
  );
  app.use("/static", express.static("uploads"));
  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    graphqlHTTP({ schema })
  );

  const PORT = process.env.PORT;

  server.applyMiddleware({ app });
  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Sever is running on http://localhost:${PORT}${server.graphqlPath} ✅`
    );
  });
};

main();
