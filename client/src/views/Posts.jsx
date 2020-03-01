import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ReactQuill from "react-quill";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import qs from "qs";
import PostView from "../components/Post";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      posts: [],
      text: "",
      title: ""
    };
  }
  handleChange = html => {
    this.setState({ text: html });
  };
  componentDidMount() {
    this.fetchPosts();
  }
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  fetchPosts() {
    axios.get("/posts/all").then(res => {
      if (res.data.data) {
        this.setState({
          posts: res.data.data
        });
      }
    });
  }
  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };
  handleClose = () => {
    this.setState({
      open: false
    });
  };
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  submit = () => {
    let post = {
      username: this.props.auth.user.username,
      title: this.state.title,
      content: this.state.text
    };
    axios.post("/posts", qs.stringify(post)).then(res => {
      var posts = this.state.posts;
      posts.push(res.data.data);
      this.setState({
        posts: posts,
        text: "",
        title: ""
      });
    });
  };
  handleExpandClick = () => {};
  render() {
    return (
      <div>
        <Grid container justify="center">
          <Button
            variant="outlined"
            color="primary"
            onClick={this.handleClickOpen}
          >
            Create a new Post
          </Button>
        </Grid>
        {this.state.posts.map(post => (
          <div key={post.id}>
            <PostView post={post} />
            <br />
            <br />
          </div>
        ))}
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          fullScreen
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <AppBar>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={this.handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6">Create Post</Typography>
            </Toolbar>
          </AppBar>
          <DialogTitle id="alert-dialog-slide-title">
            {"Create Post"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              value={this.state.title}
              onChange={this.onChange}
              fullWidth
            />
            <ReactQuill
              className="editable"
              value={this.state.text}
              id="text"
              modules={Dashboard.modules}
              formats={Dashboard.formats}
              onChange={this.handleChange}
              placeholder="Enter text here"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
            <Button onClick={this.submit} color="primary">
              Post
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
Dashboard.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video"
];
Dashboard.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" }
    ],
    ["link", "image", "video"],
    ["clean"]
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  }
};

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { logoutUser })(Dashboard);
