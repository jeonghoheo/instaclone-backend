require("dotenv").config();
import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./users/user.resolver";
import { customAuthChecker } from "./common/custom-auth-checker/custom-auth-checker";

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
    validate: true,
    authChecker: customAuthChecker
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const context = {
        authorization: req.headers.authorization
      };
      return context;
    }
  });

  const PORT = process.env.PORT;

  server
    .listen(PORT)
    .then(() =>
      console.log(`🚀 Sever is running on http://localhost:${PORT} ✅`)
    );
};

main();
