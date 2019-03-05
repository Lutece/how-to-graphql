const express = require("express");
const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  type File {
    name: String
  }

  type Query {
    uploads: [File]
  }

  type Mutation {
    uploadFile(file: Upload!): File!
  }
`;

const resolvers = {
  Query: {
    uploads: (parent, args) => {}
  },
  Mutation: {
    async uploadFile(parent, data) {
      const { createReadStream, filename } = await data.file;

      const imageStream = createReadStream();
      console.log(imageStream);
      console.log(data.file);
      // 1. Validate file metadata.

      imageStream.pipe(fs.createWriteStream("./image.png"));
      // 2. Stream file contents into cloud storage:
      // https://nodejs.org/api/stream.html

      // 3. Record the file upload in your DB.
      // const id = await recordFile( … )

      return { name: filename };
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4001 }, () =>
  console.log(`🚀 Server ready at http://localhost:4001${server.graphqlPath}`)
);
