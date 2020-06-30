import React, { useState, useEffect } from 'react';
import './App.css';
import snoowrap from 'snoowrap';
import { checkURL, fetchAnonymousToken } from './helpers';
import Header from './components/Header';

function App() {

  const [links, setLinks] = useState([]);
  const [anonymousSnoowrap, setAnonymousSnoowrap] = useState(null);
  const [sub, setSub] = useState('husky');

  async function setSnoowrap() {
    const anonymousToken = localStorage.getItem('anonymousToken');
    const time = localStorage.getItem('time');
    const currentTime = Math.round(new Date().getTime() / 1000.0); // Time in epoch
    let token = null;

    // Check if token exist or has expired
    // The time is in epoch time 3600 is one hour
    if (!anonymousToken || currentTime - time > 3600) {
      token = await fetchAnonymousToken();
      console.log(token+'1')
      localStorage.setItem('anonymousToken', token);
      localStorage.setItem('time', currentTime);
    }

    // Setup snoowrap with new or existing token
    setAnonymousSnoowrap(
      new snoowrap({
      userAgent: 'imgal',
      accessToken: token || anonymousToken,
    }));
  }

  async function getPosts() {
    setLinks(
      await anonymousSnoowrap
      .getHot(sub)
      .reduce((newList, post, key) => {
        if (checkURL(post.url)) {
          newList.push(<img src={post.url} key={key} alt="test" />);
        }
        return newList;
      }, []));
  }

  // getPosts uses snoowrap so it has to wait for setSnoowrap to finish before it will work
  // async function startUp() {
  //   await setSnoowrap();
  //   // getPosts();
  // }

  // Function for user to change subreddit
  const setSubreddit = newSubreddit => {
    setSub(newSubreddit)
    // this.startUp();
  };

  useEffect(() =>{
    async function startUp() {
      await setSnoowrap();
      //getPosts();
    }
    startUp();
  }, [])

  return (
    <div className="App">
      <Header setSubreddit={setSubreddit} currentSubreddit={sub}/>
    </div>
      );
}

export default App;
