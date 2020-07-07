import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useReducer,
} from 'react';
import './App.css';
import snoowrap from 'snoowrap';
import { checkURL, fetchAnonymousToken } from './helpers';
import Header from './components/Header';
import Macy from 'macy';

function App() {
  window.setTimeout(() => {
    Macy.init({
      container: '.content',
      column: 6,
      margin: 24,
      trueOrder: true,
      waitForImages: true,
      breakAt: {
        1200: 6,
        940: 3,
        520: 2,
        400: 1,
      },
    });
    return true;
  }, 0);

  const imgReducer = (state, action) => {
    switch (action.type) {
      case 'STACK_IMAGES':
        return { ...state, images: state.images.concat(action.images) };
      case 'FETCHING_IMAGES':
        return { ...state, fetching: action.fetching };
      default:
        return state;
    }
  };

  const pageReducer = (state, action) => {
    switch (action.type) {
      case 'ADVANCE_PAGE':
        return { ...state, after: state.after + 25 };
      default:
        return state;
    }
  };

  const [pager, pagerDispatch] = useReducer(pageReducer, { after: 0 });

  const [imgData, imgDispatch] = useReducer(imgReducer, {
    images: [],
    fetching: true,
  });

  const [sub, setSub] = useState('husky');
  let anonymousSnoowrap = useRef(null);

  const setSnoowrap = useCallback(async () => {
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
    anonymousSnoowrap.current = new snoowrap({
      userAgent: 'imgal',
      accessToken: token || anonymousToken,
    });
  }, []);

  // Function for user to change subreddit
  const setSubreddit = (newSubreddit) => {
    setSub(newSubreddit);
  };

  useEffect(() => {
    async function startUp() {
      await setSnoowrap();
      // getPosts();
      imgDispatch({ type: 'FETCHING_IMAGES', fetching: true });
      imgDispatch({
        type: 'STACK_IMAGES',
        images: await anonymousSnoowrap.current.getHot(sub, {
          limit: 25,
          after: pager.after,
        }),
      });
    }
    startUp();
  }, [setSnoowrap, sub]);

  return (
    <div className="App">
      <Header setSubreddit={setSubreddit} currentSubreddit={sub} />
      <div className="content">
        {imgData.images.map((post, i) => {
          if (checkURL(post.url)) {
            return (
              <img
                src={post.url}
                key={i}
                alt={post.title}
                className="card-img-top"
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default App;
