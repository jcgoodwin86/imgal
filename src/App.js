import React, { Component } from 'react';
import snoowrap from 'snoowrap';
import logo from './logo.svg';
import './App.css';
import fetchAnonymousToken from './helpers';

class App extends Component {
  state = {
    links: [],
    anonymousSnoowrap: null,
  };

  async setSnoowrap() {
    const anonymousToken = localStorage.getItem('anonymousToken');
    const time = localStorage.getItem('time');
    const currentTime = Math.round(new Date().getTime() / 1000.0); // Time in epoch
    let token = null;

    // Check if token exist or has expired
    // The time is in epoch time 3600 is one hour
    if (!anonymousToken || currentTime - time > 3600) {
      token = await fetchAnonymousToken();
      localStorage.setItem('anonymousToken', token);
      localStorage.setItem('time', currentTime);
    }

    // Setup snoowrap with new or existing token
    const anonymousSnoowrap = new snoowrap({
      userAgent: 'imgal',
      accessToken: token || anonymousToken,
    });

    this.setState({
      anonymousSnoowrap,
    });
  }

  async getPosts() {
    const links = await this.state.anonymousSnoowrap
      .getHot('spaceporn')
      .map((post, key) => <img src={post.url} key={key} alt="test" />);

    this.setState({
      links,
    });
  }

  // getPosts uses snoowrap so it has to wait for setSnoowrap to finish before it will work
  async startUp() {
    await this.setSnoowrap();
    this.getPosts();
  }

  componentDidMount() {
    this.startUp();
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
