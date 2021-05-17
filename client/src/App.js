import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Login from './Login.js';
import Register from './Register.js';
import Dashboard from './Dashboard.js';
import TopNav from './TopNav.js'

const logo = require('./assets/redisLogo.png');

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%'
  },
  Card: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  viewButtons: {
    backgroundColor: '#14e4ff',
    padding: '0'
  },
  viewLinks: {
    display: 'block', 
    height: '100%', 
    width: '100%', 
    textDecoration: 'none'
  }
});

class App extends React.Component {
  state = {loggedIn: false}
  
  showDash = () => {
    return(<Dashboard loggedIn={this.state.loggedIn}/>)
  };

  showLogin = () => {
    return(<div><TopNav/><Login handleLogin={this.handleLogin}/></div>)
  };

  showRegister = () => {
    return(<div><TopNav/><Register /></div>)
  };

  handleLogin = () => {
    this.setState({loggedIn: true}) 
  }

  handleLogout = () => {
    this.setState({loggedIn: false}) 
  }

  

  render(){
    const { classes } = this.props;

    return (
      <Router>
        <div className={classes.root}>
          <Route path="/Dashboard"  component={this.showDash} />
          <Route exact path={["/","/Login"]} component={this.showLogin} />
          <Route path="/Register" component={this.showRegister} />
          <a style={{width: '100%', position: "fixed", display: 'flex', justifyContent: 'center', bottom: '10px', alignItems: 'center'}}>
            <Typography variant="body3" component="p" color="textSecondary">
              Powered by
            </Typography>
            <img alt="Redis" src={logo} style={{width: '5%'}}></img>
          </a>
        </div>
      </Router>  
      )
    }
  }
const appWrapped = withStyles(styles)(App);

export default appWrapped;
