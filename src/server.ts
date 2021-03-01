import { PrismaClient } from "@prisma/client";
import { ApolloServer, gql } from "apollo-server";
import { Resolvers } from "./types";

const client = new PrismaClient();

const typeDefs = gql`
  type Movie {
    id: Int!
    title: String!
    year: Int!
    genre: String
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    movies: [Movie]
    movie: Movie
  }
  type Mutation {
    createMovie(title: String!, year: Int!, genre: String): Movie
    deleteMovie(title: String!): Boolean
  }
`;

const resolvers: Resolvers = {
  Query: {
    movies: () => client.movie.findMany(),
    movie: (_, { id }) => ({
      title: "영화",
      year: 2021
    })
  },
  Mutation: {
    createMovie: (_, { title, year, genre }) =>
      client.movie.create({
        data: {
          title,
          year,
          genre
        }
      }),
    deleteMovie: (_, { id }) => {
      return true;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen()
  .then(() => console.log("Sever is running on http://localhost:4000"));
