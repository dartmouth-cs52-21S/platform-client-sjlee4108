import { ActionTypes } from '../actions';

const initState = {
  all: [],
  current: {},
};

const PostsReducer = (state = initState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_POST:
      return { ...state, current: action.payload };
    case ActionTypes.FETCH_POSTS:
      return { ...state, all: action.payload };
    case ActionTypes.ERROR_SET:
      return state;
    default:
      return state;
  }
};

export default PostsReducer;
