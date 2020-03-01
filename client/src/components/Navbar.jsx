import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import { withStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";

const useStyles = theme => {
  return {
    root: {
      flexGrow: 1
    },
    menuButton: {},
    title: {
      flexGrow: 1
    }
  };
};

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null
    };
  }
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  handleProfileMenuOpen = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };
  handleMobileMenuClose = () => {
    this.setState({
      mobileMoreAnchorEl: null
    });
  };
  handleMenuClose = () => {
    this.setState({
      anchorEl: null
    });
    this.handleMobileMenuClose();
  };
  render() {
    const menuId = "primary-search-account-menu";
    const { classes } = this.props;
    const isMenuOpen = Boolean(this.state.anchorEl);
    const renderMenu = (
      <Menu
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>
          <Link
            underline="none"
            component={RouterLink}
            to={"/profile/" + this.props.auth.user.username}
          >
            Profile
          </Link>
        </MenuItem>
      </Menu>
    );
    let l;
    if (this.props.auth.isAuthenticated) {
      l = (
        <div>
          <Button color="inherit" onClick={this.onLogoutClick}>
            Logout
          </Button>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={this.handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </div>
      );
    } else {
      l = (
        <div>
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
          <Button color="inherit" component={RouterLink} to="/register">
            Signup
          </Button>
        </div>
      );
    }
    return (
      <div>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <Link color={"inherit"} component={RouterLink} to="/" underline="none">
                SCL-Forum
              </Link>
            </Typography>
            {l}
          </Toolbar>
        </AppBar>
        {renderMenu}
        <Toolbar />
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
Navbar = withStyles(useStyles, { name: "Navbar" })(Navbar);
export default connect(mapStateToProps, { logoutUser })(Navbar);
