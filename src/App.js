import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback
} from 'react';
import './App.css';
import snoowrap from 'snoowrap';
import { checkURL, createToken } from './helpers';
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

  const [sub, setSub] = useState('husky');
  let afterRef = useRef('');

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
    fetching: false,
  });

  const setSnoowrap = async () => {
    // Setup snoowrap with token
    const token = await createToken()
    return (new snoowrap({
      userAgent: 'imgal',
      accessToken: token
    }));
  };

  // Function for user to change subreddit
  const setSubreddit = (newSubreddit) => {
    setSub(newSubreddit);
  };

  const getPost = useCallback(async () => {
    const anonymousSnoowrap = await setSnoowrap()
  
    imgDispatch({ type: 'FETCHING_IMAGES', fetching: true });
    await anonymousSnoowrap
      .getHot(sub, {
        limit: 25,
        after: afterRef.current,
      })
      .then((posts) => {
        imgDispatch({ type: 'STACK_IMAGES', images: posts });
        afterRef.current = posts[posts.length - 1].name;
      });
  }, [sub])

  useEffect(() => {
    imgDispatch({ type: 'CLEAR_STACK', images: [] });
    afterRef.current = '';
    getPost();
  }, [getPost, sub]);

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
                  loading="lazy"
                />
              );
            }
            return null;
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default App;
