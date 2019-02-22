import React, { Component } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';

import './App.css';
import ChannelsListWithData from './components/ChannelsListWithData';
import NotFound from './components/NotFound';
import ChannelDetails from './components/ChannelDetails';

import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  toIdValue,
} from 'react-apollo';

//웹소켓 서버 기반으로 만들어진 GraphQL 서버를 바라보게 한다.
const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/graphql' });
networkInterface.use([{
  applyMiddleware(req, next) {
    setTimeout(next, 500);
  },
}]);

//데이터가 Normalizing(정규화)되어 저장되는 인메모리 공간에서 데이터를 식별하기 위해 거치는 데이터를 정규화시키는 진행된다.
//여기서 정규화란, 일관된 형태로 만들어지는 것을 의미한다. 캐싱된 공간에서 저장되는 데이터의 특정한 형태를 의미한다.
function dataIdFromObject (result) {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
}

const client = new ApolloClient({
  networkInterface,
  customResolvers: { //저장된 데이터를 불러올 때 캐싱된 데이터를 키를 통해 찾아 불러올 떄 사용하게 된다. 타입과 키를 통해 검색하게 된다.
    Query: {
      channel: (_, args) => {
        return toIdValue(dataIdFromObject({ __typename: 'Channel', id: args['id'] }))
      },
    },
  },
  dataIdFromObject,
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div className="App">
            <Link to="/" className="navbar">React + GraphQL Tutorial</Link>
            <Switch>
              <Route exact path="/" component={ChannelsListWithData}/>
              <Route path="/channel/:channelId" component={ChannelDetails}/>
              <Route component={ NotFound }/>
            </Switch>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
