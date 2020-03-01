import React, { Component } from "react";
import { Typography, Grid } from "@material-ui/core";

class Home extends Component {
  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (localStorage.getItem("jwtToken")) {
      this.props.history.push("/posts");
    }
  }

  render() {
    return (
      <Grid container justify="center">
        <Typography gutterBottom variant="h3">
          Supply Chain And Logistics Forum
        </Typography>
        <Typography gutterBottom variant="h6">
          When it comes to supply chain and logistics, a lot of the people don’t
          know what actually that is. The best way to learn about new things is
          to read about it and we at Edgistify have collected three years of
          ground intelligence that we want to share.
        </Typography>
        <Typography gutterBottom variant="subtitle1">
          So to do that we want a web application with mobile friendly UI where
          anyone can come and register. Users can login to that portal and post
          something about the industry. Other users can view the posts and the
          comments on the same. Author of the post can comment back or anyone
          can comment on the comment.
        </Typography>
        <Typography gutterBottom variant="h6">
          Features:{" "}
        </Typography>
        <ul>
          <Typography gutterBottom>
            <li>Register</li>
            <li>Login</li>
            <li>Create Post</li>
            <li>User Profile</li>
            <li>Add Comment to Post</li>
            <li>Delete Post</li>
            <li>Delete Comment</li>
          </Typography>
        </ul>
      </Grid>
    );
  }
}
export default Home;
