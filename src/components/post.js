import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

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

    return (
      <div className="postContainer">
        <div className="postCard">
          <div className="titleContainer">
            <h1>{props.current.title}</h1>
            <IconButton>
              <NavLink to={`/posts/${props.current.id}/edit`}>
                <EditIcon />
              </NavLink>
            </IconButton>
            <IconButton onClick={() => props.deletePost(props.current.id, props.history)}>
              <TrashIcon />
            </IconButton>
          </div>
          <div className="tagnameContainer">
            <h4>{splitData[2]}</h4>
            <h5>{`By. ${splitData[0]}`}</h5>
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
  }
);

export default withRouter(connect(mapStateToProps, { fetchPost, deletePost })(Post));
