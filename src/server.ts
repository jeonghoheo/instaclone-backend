import { ApolloServer } from "apollo-server";
import typeDefs from "./movies/movies.typedefs";

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen()
  .then(() => console.log("Sever is running on http://localhost:4000"));
