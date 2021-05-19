import axios from 'axios';

// const ROOT_URL = 'http://localhost:9090/api';
const ROOT_URL = 'https://lab5-platform-api.herokuapp.com/api';
const API_KEY = '';

// keys for actiontypes
export const ActionTypes = {
  FETCH_POSTS: 'FETCH_POSTS',
  FETCH_POST: 'FETCH_POST',
  ERROR_SET: 'ERROR',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
};
// trigger to deauth if there is error
// can also use in your error reducer if you have one to display an error message
export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
  };
}

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
    const tokenInfo = JSON.parse(localStorage.getItem('token'));
    axios.post(`${ROOT_URL}/posts${API_KEY}`, post, { headers: { authorization: tokenInfo.token } });
    history.push('/');
    dispatch(fetchPosts());
  };
}

export function updatePost(post, updateHome, history) {
  return (dispatch) => {
    const tokenInfo = JSON.parse(localStorage.getItem('token'));
    axios.put(`${ROOT_URL}/posts/${post.id}${API_KEY}`, post, { headers: { authorization: tokenInfo.token } })
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
    const tokenInfo = JSON.parse(localStorage.getItem('token'));
    axios.delete(`${ROOT_URL}/posts/${id}${API_KEY}`, { headers: { authorization: tokenInfo.token } });
    history.push('/');
    dispatch(fetchPosts());
  };
}

export function signinUser({ email, password }, history) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/signin`, { email, password })
      .then((response) => {
        dispatch({ type: ActionTypes.AUTH_USER, payload: email });
        // eslint-disable-next-line quote-props
        localStorage.setItem('token', JSON.stringify({ 'token': response.data.token, 'email': email }));
        history.push('/');
      })
      .catch((error) => {
        dispatch(authError(`Sign In Failed: ${error}`));
      });
  };
}

export function signupUser({ email, password }, history) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then((response) => {
        dispatch({ type: ActionTypes.AUTH_USER, payload: email });
        // eslint-disable-next-line quote-props
        localStorage.setItem('token', JSON.stringify({ 'token': response.data.token, 'email': email }));
        history.push('/');
      })
      .catch((error) => {
        console.log(error);
        dispatch(authError(`Sign Up Failed: ${error.response.data}`));
      });
  };
}

// deletes token from localstorage
// and deauths
export function signoutUser(history) {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: ActionTypes.DEAUTH_USER });
    history.push('/');
  };
}
