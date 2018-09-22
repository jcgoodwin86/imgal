import React, { Component } from 'react';
import snoowrap from 'snoowrap';
import logo from './logo.svg';
import './App.css';
import fetchAnonymousToken from './helpers';

/*
TODO: Setup where fetchAnonymousToken will be saved in local storage with a timestamp
TODO: Then setSnoowrap will check for anonymousToken in local storage also check timestamp because token only last one hour
TODO: If local storage doesn't have a token or it has expired, it will create a new one
*/

class App extends Component {
  state = {
    links: [],
    anonymousSnoowrap: null,
  };

  setSnoowrap = () => {
    const anonymousSnoowrap = new snoowrap({
      userAgent: 'imgal',
      accessToken: fetchAnonymousToken(),
    });
    this.setState({
      anonymousSnoowrap,
    });
  };

  getPost = posts => {
    const links = posts.map((post, key) => (
      <img src={post} key={key} alt="test" />
    ));
    this.setState({
      links,
    });
  };

  componentWillMount() {
    // ! setSnoowrap need to run before everything else to be able to use it.
    // TODO: Find out if this is the best way to run setSnoowrap
    this.setSnoowrap();
  }

  componentDidMount() {
    this.state.anonymousSnoowrap
      .getHot('spaceporn')
      .map(post => post.url)
      .then(this.getPost);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {this.state.links}
      </div>
    );
  }
}

export default App;
