import React, { Component } from 'react';
import './App.css';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_POKEMONS = gql`
  {
    pokemons(first: 100) {
      image
      name
      maxHP
      classification
      resistant
      weaknesses
      types
    }
  }
`;

const boxWrapperCSS = { lineHeight: '36px', marginBottom: '10px' };
const PokemonItem = ({ pokemon }) => {

  const { 
    image, 
    name, 
    maxHP, 
    classification, 
    resistant, 
    weaknesses, 
    types 
  } = pokemon;

  return(
    <div className="box">
      <article className="media">
        <div className="media-left">
          <figure className="image is-128x128">
            <img src={image} alt="pokemon" />
          </figure>
        </div>
        <div className="media-content">
          <div className="content">
            <div>
              <strong>{name}</strong> <small>@{name}</small> / <small>{maxHP} HP </small>
              <br />
              <p>분류 : {classification}</p>
              <div style={boxWrapperCSS}>
                속성: {types.map((type, key) => <button className="button" key={key}>{type}</button>)}
              </div>
              <div style={boxWrapperCSS}>
                강한 속성: {resistant.map((resist, key) => <button className="button" key={key}>{resist}</button>)}
              </div>
              <div style={boxWrapperCSS}>
                약한 속성: {weaknesses.map((weak, key) => <button className="button" key={key}>{weak}</button>)}
              </div>
            </div>
          </div>
          <nav className="level is-mobile">
            <div className="level-left">
              <a className="level-item" aria-label="reply">
                <span className="icon is-small">
                  <i className="fas fa-reply" aria-hidden="true"></i>
                </span>
              </a>
              <a className="level-item" aria-label="retweet">
                <span className="icon is-small">
                  <i className="fas fa-retweet" aria-hidden="true"></i>
                </span>
              </a>
              <a className="level-item" aria-label="like">
                <span className="icon is-small">
                  <i className="fas fa-heart" aria-hidden="true"></i>
                </span>
              </a>
            </div>
          </nav>
        </div>
      </article>
    </div>
  )
};

class App extends Component {
  render() {

    // this.props.client.query({ query: GET_POKEMONS}).then(data => {
    //   console.log(data);
    // })

    return (
      <section>
        <Query query={GET_POKEMONS}>
            {({ loading, error, data: { pokemons }}) => {
              if(loading || pokemons.length === 0) {
                return <div style={{position: 'absolute', left: '50%', top: '50%', marginLeft: '-35px', marginTop: '-30px'}}>Loading...</div>;
              }

              return pokemons.map((pokemon, key) => <PokemonItem pokemon={pokemon} key={key} />)
            }}
          </Query>
      </section>
    );
  }
}

export default App;
