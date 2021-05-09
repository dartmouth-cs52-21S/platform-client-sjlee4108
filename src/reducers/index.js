// the starting point for your redux store
// this defines what your store state will look like
import { combineReducers } from 'redux';

import PostsReducer from './postsReducer';

const rootReducer = combineReducers({
  posts: PostsReducer,
});

export default rootReducer;
