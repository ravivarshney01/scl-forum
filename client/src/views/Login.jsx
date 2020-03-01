import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/posts");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/posts"); // push user to dashboard when they login
    }
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
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData).catch(() => {
      console.log(this.props.errors);
      this.setState({
        errors: this.props.errors
      });
    });
  };

  render() {
    const { errors } = this.state;
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
                <b>Login</b> below
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                Don't have an account? <Link to="/register">Register</Link>
              </Typography>
              <p className="grey-text text-darken-1"></p>
            </div>
            <ValidatorForm
              onSubmit={this.onSubmit}
              onError={errors => console.log(errors)}
            >
              <TextValidator
                label="Email"
                name="email"
                id="email"
                value={this.state.email}
                onChange={this.onChange}
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "email is not valid"]}
              />
              <br />
              <TextValidator
                label="Password"
                type="password"
                name="password"
                id="password"
                errorMessages={["this field is required"]}
                value={this.state.password}
                validators={["required"]}
                onChange={this.onChange}
              />
            </ValidatorForm>
            <Typography gutterBottom color="error">
              {this.props.errors.message}
            </Typography>
          </CardContent>
          <CardActions>
            <Button type="submit" onClick={this.onSubmit}>
              Login
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);
