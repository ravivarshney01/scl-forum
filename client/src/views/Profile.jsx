import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PostView from "../components/Post";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import {Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      posts: []
    };
  }
  componentDidMount() {
    axios.get("/users/" + this.props.match.params.username).then(res => {
      this.setState({
        user: res.data.data
      });
    });
    axios.get("/posts/user/" + this.props.match.params.username).then(res => {
      this.setState({
        posts: res.data.data
      });
    });
  }

  render() {
    return (
      <Grid container>
        <Grid item xs={12} md={3}>
          <Grid container justify="center" alignContent="center">
            <Grid>
              <img
                width="250"
                src="https://i.ya-webdesign.com/images/profile-image-png-8.png"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h5" align="center">
                {this.state.user.name}
              </Typography>
            </Grid>
            <Grid item></Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={9}>
          {this.state.posts.map(post => (
            <Grid item xs={12} key={post.id}>
              <Link
                component={RouterLink}
                underline="none"
                to={"/posts/" + post.id}
              >
                <PostView post={post} />
              </Link>
              <br />
              <br />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }
}
Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { logoutUser })(Profile);
