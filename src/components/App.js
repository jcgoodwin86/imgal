import React, { Component } from 'react';
import snoowrap from 'snoowrap';
import { injectGlobal } from 'styled-components';
import styledNormalize from 'styled-normalize';
import '../App.css';
import fetchAnonymousToken, { checkURL } from '../helpers';
import MasonryPics from './MasonryPics';
import Header from './Header';

injectGlobal`
  ${styledNormalize}

  body {font-family: 'Work Sans';}
`;

class App extends Component {
  state = {
    links: [],
    anonymousSnoowrap: null,
    subreddit: 'husky',
  };

  setSubreddit = newSubreddit => {
    let subreddit = { ...this.state.subreddit };
    subreddit = newSubreddit;
    this.setState({
      subreddit,
    });
    this.startUp();
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
      .getHot(this.state.subreddit)
      .reduce((newList, post, key) => {
        if (checkURL(post.url)) {
          newList.push(<img src={post.url} key={key} alt="test" />);
        }
        return newList;
      }, []);

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
        <Header />
        {/* Wait for links to populate before loading MasonryPics */}
        {this.state.links.length > 1 ? (
          <MasonryPics links={this.state.links} />
        ) : null}
      </div>
    );
  }
}

export default App;
