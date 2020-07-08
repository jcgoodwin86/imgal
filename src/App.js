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
import InfiniteScroll from 'react-infinite-scroll-component';

function App() {
  window.setTimeout(() => {
    Macy({
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
      case 'CLEAR_STACK':
        return { ...state, images: action.images };
      case 'FETCHING_IMAGES':
        return { ...state, fetching: action.fetching };
      default:
        return state;
    }
  };

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

  const getPost = useCallback(async () => {
    console.log('i ran');
    if (imgData.images[0]) {
      if (
        imgData.images[0].subreddit_name_prefixed.trim().toLowerCase() !==
        `r/${sub}`.trim().toLowerCase()
      ) {
        imgDispatch({ type: 'CLEAR_STACK', images: [] });
      }
    }

    imgDispatch({ type: 'FETCHING_IMAGES', fetching: true });
    imgDispatch({
      type: 'STACK_IMAGES',
      images: await anonymousSnoowrap.current.getHot(sub, {
        limit: 25,
        after: '',
      }),
    });
  }, [imgData.images, sub]);

  useEffect(() => {
    setSnoowrap();
    getPost();
  }, [sub]);

  return (
    <div className="App">
      <Header setSubreddit={setSubreddit} currentSubreddit={sub} />
      <InfiniteScroll
        dataLength={imgData.images.length}
        next={getPost}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
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
      </InfiniteScroll>
    </div>
  );
}

export default App;
