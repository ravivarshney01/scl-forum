import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import Grid from "@material-ui/core/Grid";
import ReactQuill from "react-quill";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Moment from "react-moment";
import { IconButton } from "@material-ui/core";
import { DeleteForeverOutlined } from "@material-ui/icons";
import qs from "qs";
import axios from "axios";
class Comment extends Component {
  constructor() {
    super();
    this.state = {
      comment: {}
    };
  }
  componentDidMount() {}
  deleteComment = () => {
    axios
      .post(
        "/posts/" + this.props.post_id + "/comment/delete",
        qs.stringify({ id: this.props.comment._id })
      )
      .then(res => {
        window.location.reload();
      });
  };
  render() {
    let actions;
    if (this.props.auth.user.username === this.props.comment.postedBy) {
      actions = (
        <IconButton color="secondary" onClick={this.deleteComment}>
          <DeleteForeverOutlined></DeleteForeverOutlined>
        </IconButton>
      );
    }
    return (
      <Grid>
        <Card elevation={0}>
          <CardHeader
            avatar={
              <Avatar
                aria-label="user"
                src="https://i.ya-webdesign.com/images/profile-image-png-8.png"
              ></Avatar>
            }
            title={this.props.comment.postedBy}
            subheader={
              <Moment local format="DD/MM/YYYY">
                {this.props.comment.created}
              </Moment>
            }
            action={actions}
          />
          <CardContent>
            <ReactQuill
              readOnly
              value={this.props.comment.content}
              className="notoolbar"
            ></ReactQuill>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}
Comment.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { logoutUser })(Comment);
