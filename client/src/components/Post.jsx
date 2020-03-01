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
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { IconButton } from "@material-ui/core";
import { DeleteForeverOutlined } from "@material-ui/icons";
import axios from "axios";


class Post extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {}
  deletePost = () => {
    axios.delete("/posts/" + this.props.post.id + "/delete").then(res => {
      window.location.reload()
    });
  };
  render() {
    let actions;
    if (this.props.auth.user.username === this.props.post.username) {
      actions = (
        <IconButton color="secondary" onClick={this.deletePost}>
          <DeleteForeverOutlined></DeleteForeverOutlined>
        </IconButton>
      );
    }
    return (
      <Grid>
        <Card>
          <CardHeader
            avatar={
              <Avatar
                aria-label="user"
                src="https://i.ya-webdesign.com/images/profile-image-png-8.png"
              ></Avatar>
            }
            action={actions}
            title={
              <RouterLink to={"/profile/" + this.props.post.username}>
                <Typography gutterBottom>{this.props.post.username}</Typography>
              </RouterLink>
            }
            subheader={
              <Moment local format="DD/MM/YYYY">
                {this.props.post.posted_on}
              </Moment>
            }
          />
          <Link
            color="inherit"
            component={RouterLink}
            underline="none"
            to={"/posts/" + this.props.post.id}
          >
            <CardContent>
              <Typography gutterBottom variant="h4">
                {this.props.post.title}
              </Typography>
              <ReactQuill
                readOnly
                value={this.props.post.content}
                className="notoolbar"
              ></ReactQuill>
            </CardContent>
          </Link>
        </Card>
      </Grid>
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
