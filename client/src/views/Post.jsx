import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import axios from "axios";
import qs from "qs";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PostView from "../components/Post";
import ReactQuill from "react-quill";
import { Button } from "@material-ui/core";
import Comment from "../components/Comment";

class Post extends Component {
  constructor() {
    super();
    this.state = {
      post: {},
      comment: "",
      comments: []
    };
  }
  componentDidMount() {
    this.fetchPost();
  }
  handleChange = html => {
    this.setState({ comment: html });
  };
  fetchPost() {
    axios.get("/posts/" + this.props.match.params.id).then(res => {
      this.setState({
        post: res.data.data,
        comments: res.data.data.comments
      });
    });
  }
  AddComment = e => {
    e.preventDefault();
    let data = qs.stringify({
      content: this.state.comment,
      post_id: this.props.match.params.id,
      username: this.props.auth.user.username
    });
    axios
      .post("/posts/" + this.props.match.params.id + "/comment", data)
      .then(res => {
        this.setState({
          comment: "",
          comments: res.data.data.comments
        });
      });
  };

  render() {
    return (
      <div>
        <PostView post={this.state.post} />
        <br />
        <Typography gutterBottom>Comments</Typography>
        <br />
        <Grid container>
          <Grid xs={12} item>
            <ReactQuill
              className="editable"
              value={this.state.comment}
              id="comment"
              onChange={this.handleChange}
              placeholder="Enter your thoughts here"
            />
          </Grid>
          <Button onClick={this.AddComment}>Add Comment</Button>
          {this.state.comments.map(comment => (
            <Grid key={comment._id} item xs={12}>
              <Comment
                comment={comment}
                post_id={this.props.match.params.id}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}
Post.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { logoutUser })(Post);
