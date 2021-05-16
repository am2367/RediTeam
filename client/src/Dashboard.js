import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import checkSession from './CheckSession.js';
import moment from 'moment';
import TopNav from './TopNav.js'
import Profile from './Profile.js'
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import Chip from '@material-ui/core/Chip';
import ReqModal from './ReqModal.js';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

const styles = theme => ({
  root: {
    height: '100%'
  },
  req: {
    flexGrow: 1,
  },
  req: {
    margin: '0.5rem'
  },
  Card: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  viewButtons: {
    backgroundColor: '#14e4ff',
    borderRadius: 0,
    borderRight: '1px solid #3f51b5',
    padding: '0'
  },
  viewLinks: {
    display: 'block', 
    height: '100%', 
    width: '100%', 
    textDecoration: 'none'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  button: {
    width: '33%',color: 'white', backgroundColor: '#3f51b5'
  }
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Dashboard extends React.Component {
  state = {
          loggedIn: false,
          profile: {},
          year: moment().format('YYYY'), 
          reqList: [],
          teamMembers: [],
          applications: [],
          appliedReqList: [],
          teamReqList: [],
          recommendedReqs: [],
          expanded: false,
          value: 0,
          reqModalOpen: false,
          teamManager: [],
          userNodeType: 'Employee'
        }

  componentWillMount = () => {
    let thisRef = this
    checkSession(function(result){
      if(result == false){
        thisRef.redirect()
      }
      thisRef.getEmail();
      thisRef.getProfile();
      
      // else{
      //     thisRef.getData();
      // }
    })
      
  }

  getProfile = () => {
    fetch('/api/profile')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
            if(data.length === 0){
              history.push('/Dashboard/Profile');
            }
            else{
              this.getTeamMembers();
              if(data[0].hasOwnProperty('Manager')) {
                this.setState({profile: data[0]['Manager']['properties'], teamManager: data[0]['Manager']['properties'], userNodeType: 'Manager'})
                this.getTeamReqs();
                this.getTeamApplications();
              }
              else{
                this.setState({profile: data[0]['Employee']['properties'], userNodeType: 'Employee'})
                this.getRecommendedReqs();
                this.getReqs();
                this.getAppliedReqs();
                this.getTeamManager();
              }
            }
            
        }else{
            this.props.history.push('/Login');
            alert('Ran into an error, please login again.')
        }
    })
  }

  getEmail = () => {
    fetch('/api/email')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
            this.setState({email: data})
        }else{
            this.props.history.push('/Login');
            alert('Ran into an error, please login again.')
        }
    })
  }

  getTeamMembers = () => {
    fetch('/api/team/members')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
            // console.log(JSON.parse(data))
            this.setState({teamMembers: JSON.parse(data)})
        }else{
          console.log(data)
          alert('Error Retreiving Team Members')
        }
    })
  }

  getTeamManager = () => {
    fetch('/api/team/manager')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
            console.log(JSON.parse(data))
            this.setState({teamManager: JSON.parse(data)[0]['Manager']['properties']})
        }else{
          console.log(data)
          alert('Error Retreiving Team Manager')
        }
    })
  }


  getReqs = () => {
    fetch('/api/reqs')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
            // console.log(JSON.parse(data))
            this.setState({reqList: JSON.parse(data)})
        }else{
          console.log(data)
          alert('Error Retreiving Reqs')
        }
    })
  }

  getRecommendedReqs = () => {
    fetch('/api/reqs/recommended')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
            // console.log(JSON.parse(data))
            this.setState({recommendedReqs: JSON.parse(data)})
        }else{
          console.log(data)
          alert('Error Retreiving Recommended Reqs')
        }
    })
  }

  getTeamReqs = () => {
    fetch('/api/team/reqs')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
            // console.log(JSON.parse(data))
            this.setState({teamReqList: JSON.parse(data)})
        }else{
          console.log(data)
          alert('Error Retreiving Reqs')
        }
    })
  }

  getAppliedReqs = () => {
    fetch('/api/reqs/applied')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
            // console.log(JSON.parse(data))
            this.setState({appliedReqList: JSON.parse(data)})
        }else{
          console.log(data)
          alert('Error Retreiving Applied Reqs')
        }
    })
  }

  getTeamApplications = () => {
    fetch('/api/team/applications')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
            // console.log(JSON.parse(data))
            this.setState({applications: JSON.parse(data)})
        }else{
          console.log(data)
          alert('Error Retreiving Applied Reqs')
        }
    })
  }

  apply = (reqId) => {
    let thisRef = this    
    fetch('/api/req/apply', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'},
        body: JSON.stringify({'reqId':reqId})
    })
    .then(response => response.json())
    .then(data=>{
        thisRef.getAppliedReqs()
        thisRef.getReqs()
        thisRef.getRecommendedReqs()
        if(data === "Applied for Req!"){
          alert(data);
        }
        else {
          console.log(data)
          alert("Error Applying for Req!");
        }
    })
  }

  delete = (reqId) => {
    let thisRef = this    
    fetch('/api/req/delete', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'},
        body: JSON.stringify({'reqId' : reqId})
    })
    .then(response => response.json())
    .then(data=>{
        thisRef.getTeamReqs()
        if(data === "Req Deleted!"){
          alert(data);
        }
        else {
          console.log(data)
          alert("Error Deleting Req!");
        }
    })
  }

  cancel = (reqId) => {
    let thisRef = this    
    fetch('/api/req/cancel', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'},
        body: JSON.stringify({'reqId' : reqId})
    })
    .then(response => response.json())
    .then(data=>{
        thisRef.getReqs()
        thisRef.getRecommendedReqs()
        thisRef.getAppliedReqs()
        if(data === "Req Application Cancelled!"){
          alert(data);
        }
        else {
          console.log(data)
          alert("Error Cancelling Req Application!");
        }
    })
  }

  acceptApplication = (id, reqId) => {   
    let thisRef = this 
    fetch('/api/req/accept', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'},
        body: JSON.stringify({'id' : id, 'reqId' : reqId})
    })
    .then(response => response.json())
    .then(data=>{
      thisRef.getTeamMembers()
      thisRef.getReqs();
      thisRef.getTeamApplications()
      thisRef.getTeamReqs()
        if(data === "Req Accepted!"){
          alert(data);
        }
        else {
          console.log(data)
          alert("Error Accepting Req!");
        }
    })
  }

  rejectApplication = (id, reqId) => {
    let thisRef = this
    fetch('/api/req/reject', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'},
        body: JSON.stringify({'id' : id, 'reqId' : reqId})
    })
    .then(response => response.json())
    .then(data=>{
        thisRef.getTeamApplications()
        thisRef.getTeamApplications()
        if(data === "Req Rejected!"){
          alert(data);
        }
        else {
          console.log(data)
          alert("Error Rejecting Req!");
        }
    })
  }

  showProfile = () => {
    return(<Profile refreshData={this.getProfile}/>)
  };

  // getData = () => {
  //   //console.log('request')
  //   fetch('/api/getStats/Yearly?year=' + this.state.year)
  //   .then(this.handleErrors)
  //   .then(response => response.json())
  //   .then(data=>{
  //       if(data == 'Inserted!'){
  //           console.log(data)
  //           this.getData()
  //       }else{
  //           console.log(data)
  //           this.setState({data: data})
  //       }
  //   })
  //   }

    // getMoreData = (year) => {
    //   //console.log('request')

    //   fetch('/api/getStats/Yearly?year=' + year)
    //   .then(this.handleErrors)
    //   .then(response => response.json())
    //   .then(data=>{
    //       if(data == 'Inserted!'){
    //           //console.log(data)
    //           this.getMoreData(year)
    //       }else{
    //           //console.log(data)
    //           let tempData = this.state.data
    //           tempData = Object.assign(tempData, data);
    //           console.log(tempData)
    //           this.setState({data: tempData})
    //       }
    //   })
    //   }


  redirect = () => {
    this.props.history.push('/Login');
  }
  
  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  handleExpandClick = () => {
    const expanded = this.state.expanded
    this.setState({expanded: !expanded});
  };

  handleReqModalClose = () => {
    this.setState({reqModalOpen: false})
  }

  handleReqModalOpen = () => {
    this.setState({reqModalOpen: true})
  }

  render(){
    const { classes } = this.props;

    const Req = (type, id, name, teamName, manager, associateLevel, skills, officeLocation, description, recommended) => (
      <Card className={classes.req}>
        <CardContent>
          <Typography className={classes.pos} color="textSecondary"style={{justifyContent: 'space-between', display: 'auto'}}>
            Req #{id} {recommended ? <Chip label={"Recommended"} /> : null}
          </Typography>
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="body2" component="p">
            Assocate Level: {associateLevel}
            <br />
            Skills: {skills.map((skill, index) => <Chip label={skill} />)}
            <br />
            Location: {officeLocation}
          </Typography>
        </CardContent>
        <CardActions style={{justifyContent: 'space-between', display: 'flex'}}>
          <IconButton
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Job Description"
          >
            <Typography className={classes.pos} color="textSecondary">
              Job Description
            </Typography>
            <ExpandMoreIcon className={clsx(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}/>
          </IconButton>
          {type === 'applied' ? <Button onClick={() => this.cancel(id)} size="small"  className={classes.button}>
            Cancel
          </Button> : null}
          {type === 'open' && this.state.profile['isManager'] === "true" ? <Button onClick={() => this.delete(id)} size="small" className={classes.button}>
            Delete
          </Button> : null}
          {type === 'open' && !(this.state.profile['isManager'] === "true") ? <Button onClick={() => this.apply(id)} size="small" className={classes.button}>
            Apply
          </Button> : null}
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            Team Name: {teamName}
            <br />
            Hiring Manager: {manager}
          </Typography>
          <Typography paragraph>Description:</Typography>
          <Typography paragraph>
            {description}
          </Typography>
        </CardContent>
      </Collapse>
      </Card>
    )

    const Employee = (id, name, skills, associateLevel, officeLocation, team, manager, reqId, reqName) => (
      <Card className={classes.req}>
        <CardContent>
          {this.state.value === 2 && reqId ? <Typography className={classes.pos} color="textSecondary">
            Applying for Req #{reqId}: {reqName}
          </Typography> : null}
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="body2" component="p">
            Assocate Level: {associateLevel}
            <br />
            Skills: {skills.map((skill, index) => <Chip label={skill} />)}
            <br />
            Location: {officeLocation}
            <br />
            Team: {team}
            <br />
            Manager: {manager}
          </Typography>
        </CardContent>
        <CardActions style={{justifyContent: 'space-between', display: 'flex'}}>
          {this.state.value === 2  && reqId? <Button onClick={() => this.rejectApplication(id, reqId)}  size="small" className={classes.button}>
            Reject
          </Button> : null}
          {this.state.value === 2 && reqId ? <Button onClick={() => this.acceptApplication(id, reqId)}  size="small" className={classes.button}>
            Accept
          </Button> : null}
        </CardActions>
      </Card>
    )
    
    const applications = this.state.applications.map((value, index) => {
      // console.log(value)
      return (<Grid item  xs={10} sm={10} md={10} lg={10} style={{margin: 'auto'}}>
                {Employee(
                     value['Employee']['properties']['id'],
                     value['Employee']['properties']['name'],
                     value['Employee']['properties']['programmingLanguages'],
                     value['Employee']['properties']['associateLevel'],
                     value['Employee']['properties']['officeLocation'],
                     value['Employee']['properties']['teamName'],
                     value['Employee']['properties']['manager'],
                     value['Req']['id'],
                     value['Req']['properties']['name']
                     )}
              </Grid>)
    })

    const reqs = (type, reqList, recommended) => reqList.map((value, index) => {
      // console.log(value)
      return (<Grid item  xs={10} sm={10} md={10} lg={10} style={{margin: 'auto'}}>
                {Req(type,
                     value['id'],
                     value['properties']['name'],
                     value['properties']['teamName'],
                     value['properties']['manager'],
                     value['properties']['associateLevel'],
                     value['properties']['programmingLanguages'],
                     value['properties']['officeLocation'],
                     value['properties']['description'], recommended)}
              </Grid>)
    })

    const teamMembers = this.state.teamMembers.map((value, index) => {
      // console.log(value)
      return (<Grid item  xs={10} sm={10} md={10} lg={10} style={{margin: 'auto'}}>
      {Employee(
           value['Employee']['properties']['id'],
           value['Employee']['properties']['name'],
           value['Employee']['properties']['programmingLanguages'],
           value['Employee']['properties']['associateLevel'],
           value['Employee']['properties']['officeLocation'],
           value['Employee']['properties']['teamName'],
           value['Employee']['properties']['manager']
           )}
    </Grid>)
    })

    return (
      <Router>
        <div className={classes.root}>
          <TopNav redirect={this.redirect} username={this.state.email}/>
          <Route exact path="/Dashboard/Profile" component={this.showProfile} />
          <Route exact path="/Dashboard" render={() => 
            <Grid container xs={11} sm={11} md={11} lg={11} spacing={5} style={{margin: 'auto',  marginTop: '1rem', height: '85%' }}>
                <Grid item  xs={10} sm={8} md={6} lg={6} style={{height: '100%'}}>
                    <Card style={{height: '100%', width:'100%', display: 'flex', flexDirection: 'column'}}>
                        <CardHeader style={{textAlign: 'center'}} title={this.state.profile['teamName']}/>
                        <div style={{overflow: 'auto', height: '100%'}}>

                            <Grid item  xs={10} sm={10} md={10} lg={10} style={{margin: 'auto', width: '100%'}}>
                                <Card className={classes.req}>
                                  <CardContent>
                                    <Typography variant="h5" component="h2">
                                      {this.state.teamManager ? this.state.teamManager['name'] : null}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                      Assocate Level: Manager
                                      <br />
                                      Skills: {this.state.teamManager && this.state.teamManager['programmingLanguages'] ? this.state.teamManager['programmingLanguages'].map((skill, index) => <Chip label={skill} />) : null}
                                      <br />
                                      Location: {this.state.teamManager && this.state.teamManager['officeLocation'] ? this.state.teamManager['officeLocation'] : null}
                                    </Typography>
                                  </CardContent>
                                </Card>
                            </Grid>
                              {teamMembers}
                            </div>
                    </Card>
                </Grid>

                <Grid item  xs={10} sm={8} md={6} lg={6} style={{height: '100%'}}>
                    <Card style={{height: '100%', width:'100%',display: 'flex', flexDirection: 'column'}}>
                        <CardHeader style={{textAlign: 'center'}} title="Reqs"/>
                        <Grid item  xs={10} sm={10} md={10} lg={10} style={{margin: 'auto', height: '75%'}}>
                          {this.state.profile['isManager'] === "true" ? <Button id='newReq' onClick={() => this.handleReqModalOpen()} className={classes.button} type="newReq" style={{width: '100%',color: 'white', backgroundColor: '#3f51b5', marginRight: '1%'}}>
                            New Req
                          </Button> : null}
                          <ReqModal 
                            open={this.state.reqModalOpen} 
                            // data={this.state.data.Configurations[this.state.configName]}
                            onClose={this.handleReqModalClose} 
                            refreshData={this.getTeamReqs}
                            // deleteConfiguration={this.deleteConfiguration}
                          />
                          <Tabs
                            value={this.state.value}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                          >
                            <Tab label={this.state.profile['isManager'] === "true" ? "Team Reqs" : "Open Reqs"} />
                            <Tab label="Applied" disabled={this.state.profile['isManager'] === "true"}/>
                            <Tab label="Applications" disabled={this.state.profile['isManager'] === "false"}/>
                          </Tabs>
                          <div style={{overflow: 'auto', height: '100%'}}>
                          {this.state.value === 0 && this.state.profile['isManager'] === "false" ? reqs('open', this.state.recommendedReqs, true) : null}
                          {
                            this.state.value === 0 && this.state.profile['isManager'] === "false" ? reqs('open', this.state.reqList, false) : 
                            this.state.value === 0 && this.state.profile['isManager'] === "true" ? reqs('open', this.state.teamReqList, false) :
                            this.state.value === 1 ? reqs('applied', this.state.appliedReqList, false) : 
                            this.state.value === 2 ? applications : null
                          }
                          </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
          }/>
        </div>
      </Router>  
      )
    }
  }
const dashboardWrapped = withStyles(styles)(Dashboard);
const dashboardWrappedWithRouter = withRouter(dashboardWrapped)
export default dashboardWrappedWithRouter;
