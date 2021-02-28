const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "World"
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen()
  .then(() => console.log("Sever is running on http://localhost:4000"));
