require("dotenv").config();
import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./users/user.resolver";

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
    validate: true
  });

  const server = new ApolloServer({ schema });

  const PORT = process.env.PORT;

  server
    .listen(PORT)
    .then(() =>
      console.log(`🚀 Sever is running on http://localhost:${PORT} ✅`)
    );
};

main();
