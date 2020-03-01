import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../actions/authActions";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";


class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      username: "",
      password: "",
      password2: "",
      errors: {}
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/posts");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history).catch(() => {
      console.log(this.props.errors);
      this.setState({
        errors: this.props.errors
      });
    });
  };
  render() {
    const { errors } = this.state;
    // const { classes } = this.props;
    return (
      <Grid container justify="center">
        <Card>
          <CardContent>
            <Link to="/">
              <Typography gutterBottom>
                <i className="material-icons left">keyboard_backspace</i> Back
                to home
              </Typography>
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <Typography variant="h4" gutterBottom>
                <b>Register</b> below
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                Already have an account? <Link to="/login">Log in</Link>
              </Typography>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div>
                <FormControl>
                  <InputLabel htmlFor="name">Name</InputLabel>
                  <Input
                    id="name"
                    value={this.state.name}
                    onChange={this.onChange}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input
                    id="username"
                    value={this.state.username}
                    onChange={this.onChange}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input
                    id="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    id="password"
                    type={this.state.showPassword ? "text" : "password"}
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                </FormControl>
              </div>
            </form>
            <Typography gutterBottom color="error">
              {this.props.errors.message}
            </Typography>
          </CardContent>
          <CardActions>
            <Button type="submit" onClick={this.onSubmit}>
              Register
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
// Register = withStyles(useStyles, { name: "Register" })(Register);
export default connect(mapStateToProps, { registerUser })(withRouter(Register));
