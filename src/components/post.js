import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { NavLink, Redirect, withRouter } from 'react-router-dom';

import ReactMarkdown from 'react-markdown';
import TrashIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import { fetchPost, deletePost } from '../actions';

const Post = (props) => {
  useEffect(() => {
    props.fetchPost(props.match.params.postID);
  }, []);

  if (Object.entries(props.current).length !== 0) {
    const splitData = props.current.tags.split(',');
    if (splitData[0] === 'true' && props.email !== props.current.author.email) {
      return (<Redirect to="/" />);
    }

    return (
      <div className="postContainer">
        <div className="postCard">
          <div className="titleContainer">
            <h1>{props.current.title}</h1>
            {props.auth
              ? (
                <IconButton>
                  <NavLink to={`/posts/${props.current.id}/edit`}>
                    <EditIcon />
                  </NavLink>
                </IconButton>
              ) : null}
            {props.auth
              ? (
                <IconButton onClick={() => props.deletePost(props.current.id, props.history)}>
                  <TrashIcon />
                </IconButton>
              ) : null}
          </div>
          <div className="tagnameContainer">
            <h4>{splitData[2]}</h4>
            <h5>{props.current.author ? `By. ${props.current.author.email}` : null}</h5>
          </div>
          <ReactMarkdown>{props.current.content}</ReactMarkdown>
          <a href={props.current.coverUrl} target="_blank" rel="noreferrer">{props.current.coverUrl}</a>
        </div>
      </div>
    );
  }

  return null;
};

const mapStateToProps = (state) => (
  {
    current: state.posts.current,
    auth: state.auth.authenticated,
    email: state.auth.email,
  }
);

export default withRouter(connect(mapStateToProps, { fetchPost, deletePost })(Post));
