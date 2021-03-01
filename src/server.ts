import { ApolloServer, gql } from "apollo-server";
import { Resolvers } from "./types";

const typeDefs = gql`
  type Movie {
    id: Int
    title: String
    year: Int
  }
  type Query {
    movies: [Movie]
    movie: Movie
  }
  type Mutation {
    createMovie(title: String!): Boolean
    deleteMovie(title: String!): Boolean
  }
`;

const resolvers: Resolvers = {
  Query: {
    movies: () => [],
    movie: () => ({
      title: "영화",
      year: 2021
    })
  },
  Mutation: {
    createMovie: (_, { title }) => {
      console.log(title);
      return true;
    },
    deleteMovie: (_, { title }) => {
      console.log(title);
      return true;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen()
  .then(() => console.log("Sever is running on http://localhost:4000"));
