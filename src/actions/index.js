import axios from 'axios';

// const ROOT_URL = 'https://platform.cs52.me/api';
// const API_KEY = '?key=S_Lee';
const ROOT_URL = 'http://localhost:9090/api';
const API_KEY = '';

// keys for actiontypes
export const ActionTypes = {
  FETCH_POSTS: 'FETCH_POSTS',
  FETCH_POST: 'FETCH_POST',
  ERROR_SET: 'ERROR',
};

export function fetchPosts() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts${API_KEY}`)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_POSTS, payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
export function fetchPost(id, callback) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts/${id}${API_KEY}`)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
        if (callback != null) {
          callback(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}

export function createPost(post, history) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/posts${API_KEY}`, post);
    history.push('/');
    dispatch(fetchPosts());
  };
}

export function updatePost(post, updateHome, history) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/posts/${post.id}${API_KEY}`, post)
      .then((response) => {
        if (updateHome) {
          dispatch(fetchPosts());
        } else {
          dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
          history.push(`/posts/${post.id}`);
        }
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}

export function deletePost(id, history) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/posts/${id}${API_KEY}`);
    history.push('/');
    dispatch(fetchPosts());
  };
}
