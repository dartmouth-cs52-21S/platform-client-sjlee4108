import {
  withStyles, TextField, Button, FormControlLabel, Switch,
} from '@material-ui/core';
import React from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { updatePost, fetchPost } from '../actions';

const useStyles = (theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1.5),
    },
  },
});

class EditPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '', tag: '', private: false, content: '', link: '',
    };
  }

  componentDidMount() {
    this.props.fetchPost(this.props.match.params.postID, (d) => this.updateState(d));
  }

  handleChange(e, type) {
    if (type === 'title') {
      this.setState((prevState) => ({ ...prevState, title: e.target.value }));
    } else if (type === 'content') {
      this.setState((prevState) => ({ ...prevState, content: e.target.value }));
    } else if (type === 'link') {
      this.setState((prevState) => ({ ...prevState, link: e.target.value }));
    } else if (type === 'tag') {
      this.setState((prevState) => ({ ...prevState, tag: e.target.value }));
    }
  }

  onClickSubmit() {
    if (this.onCheckInput()) {
      this.props.updatePost({
        title: this.state.title,
        tags: `${this.state.private},0,${this.state.tag}`,
        coverUrl: this.state.link,
        content: this.state.content,
        id: this.props.current.id,
      }, false, this.props.history);
    }
  }

  onCheckInput() {
    return this.onCheckValidTag() && this.onCheckValidTitle()
     && this.isValidHttpUrl();
  }

  onCheckValidTag() {
    if (/\s/.test(this.state.tag) || this.state.tag.length < 3 || this.state.tag.length > 15) {
      return false;
    }
    return true;
  }

  onCheckValidTitle() {
    if (this.state.title.length < 3 || this.state.title.length > 30) {
      return false;
    }
    return true;
  }

  updateState(d) {
    const splitData = d.tags.split(',');
    this.setState({
      title: d.title,
      tag: splitData[2],
      private: splitData[0] === 'true',
      link: d.coverUrl,
      content: d.content,
    });
  }

  isValidHttpUrl() {
    let url;

    try {
      url = new URL(this.state.link);
    } catch (_) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
  }

  render() {
    const { classes } = this.props;
    return (
      <form className={classes.root} noValidate autoComplete="off">
        <div className="form">
          <div className="formTop">
            <h1>Edit the Selected Row</h1>
            <Button onClick={() => this.onClickSubmit()} variant="contained" color="primary">Save</Button>
          </div>
          <TextField
            id="title_field"
            label="Title"
            value={this.state.title}
            onChange={(e) => this.handleChange(e, 'title')}
            variant="filled"
            error={this.state.title !== '' && !this.onCheckValidTitle()}
            helperText={this.state.title !== '' && !this.onCheckValidTitle() ? 'Title must be between 3 to 30 characters' : null}

          />
          <TextField
            id="tag_field"
            label="Tag"
            value={this.state.tag}
            onChange={(e) => this.handleChange(e, 'tag')}
            variant="filled"
            error={this.state.tag !== '' && !this.onCheckValidTag()}
            helperText={this.state.tag !== '' && !this.onCheckValidTag() ? 'Title must be between 3 to 15 characters and cannot have whitespaces' : null}

          />
          <TextField
            id="link_field"
            label="Link"
            value={this.state.link}
            onChange={(e) => this.handleChange(e, 'link')}
            variant="filled"
            placeholder="Link including https://"
            error={this.state.link !== '' && !this.isValidHttpUrl()}
            helperText={this.state.link !== '' && !this.isValidHttpUrl() ? 'Provide full valid url address including https:// or http://' : null}

          />
          <TextField
            id="content_field"
            label="content"
            multiline
            rows={6}
            value={this.state.content}
            onChange={(e) => this.handleChange(e, 'content')}
            placeholder="Supports markdown!"
            variant="filled"
          />
          <FormControlLabel
            control={(
              <Switch checked={this.state.private}
                onChange={(e) => this.setState({ private: e.target.checked })}
              />
            )}
            label="Set as Private"
          />

        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  current: state.posts.current,
});

export default withRouter(
  connect(mapStateToProps, { fetchPost, updatePost })(withStyles(useStyles)(EditPost)),
);
