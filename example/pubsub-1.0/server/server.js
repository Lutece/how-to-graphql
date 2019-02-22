
import express from 'express';
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
//Graphql 서버

import bodyParser from 'body-parser'; //클라이언트의 요청 바디를 유연하게 받기 위해
import cors from 'cors'; //포트가 다른 요청을 받아들이게 하기 위해

import { schema } from './src/schema'; //graphql schema

import { execute, subscribe } from 'graphql'; //graphql core 부분 - 전달된 req를 평가, 구독하기 위한 기능을 담고있음.
import { createServer } from 'http'; //node의 HTTP
import { SubscriptionServer } from 'subscriptions-transport-ws'; //Websocket의 기반을 둔 GraphQL Client, Server
//WebSocket 서버 인스턴스를 생성
//이 서버 인스턴스는 GraphQL의 PubSub 시스템이 적용될 수 있도록 graphql의 execute와 subscribe를 담고있다.

const PORT = 4000;
const server = express();

server.use('*', cors({ origin: 'http://localhost:3000' }));

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
}));

// We wrap the express server so that we can attach the WebSocket for subscriptions
const ws = createServer(server);

ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);

  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});
