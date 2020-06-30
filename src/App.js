import React, { useState, useEffect } from 'react';
import './App.css';
import snoowrap from 'snoowrap';
import { checkURL, fetchAnonymousToken } from './helpers';
import Header from './components/Header';

function App(props) {

  const [links, setLinks] = useState(null);
  const [sub, setSub] = useState('husky');
  // const [anonymousSnoowrap, setAnonymousSnoowrap] = useState(null)
  let anonymousSnoowrap = null;


  async function setSnoowrap() {
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
    anonymousSnoowrap = new snoowrap({
      userAgent: 'imgal',
      accessToken: token || anonymousToken,  
    })
       
  }

  async function getPosts() {
    setLinks(await anonymousSnoowrap
      .getHot(sub)
      .reduce((newList, post, key) => {
        if (checkURL(post.url)) {
          newList.push(<img src={post.url} key={key} alt="test" />);
        }
        return newList;
      }, []));
  }

  // Function for user to change subreddit
  const setSubreddit = newSubreddit => {
    setSub(newSubreddit)
  };

  useEffect(() =>{
    async function startUp() {
      await setSnoowrap();
      getPosts();
    }

    startUp();
  },[sub])

  return (
    <div className="App">
      <Header setSubreddit={setSubreddit} currentSubreddit={sub}/>
      <div className='content'>
        {links}
      </div>
    </div>
      );
}

export default App;
