import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import { withRouter } from 'react-router-dom';
import checkSession from './CheckSession.js';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      width: '100%',
      marginTop: 20
    },
    inputLabelFocused: {
      color: 'blue',
    },
    textFieldRoot: {
      padding: 0,
      'label + &': {
        marginTop: theme.spacing.unit * 3,
      },
    },
    textFieldInput: {
      borderRadius: 4,
      backgroundColor: theme.palette.common.white,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 12px',
      width: 'calc(100% - 24px)',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
    textFieldFormLabel: {
      fontSize: 18,
    }
  });
const programmingLanguages = ['Python', 'Javascript', 'Node.js', 'Golang', 'Ruby', 'PHP', 'Java']

class ReqModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = Object.assign({},{
        reqNameError : false,
        associateLevelError: false,
        officeLocationError : false, 
        associateLevel: '',
        officeLocation: '',
        name : '',
        programmingLanguages : []
         }, this.props.data)
  }
  
  state = {}

  handleClose = () => {
    this.props.onClose();
  };

  componentWillMount = () => {
    let thisRef = this
    checkSession(function(result){
      if(result === false){
        thisRef.redirect()
      }
    })
  }

  componentWillReceiveProps = (nextProps) => {
      this.setState({configName: nextProps.configName})
  }

  createReq = () => {
    fetch('/api/team/req', {
      method: 'post',
      headers: {
          'Content-type': 'application/json'},
      body: JSON.stringify({name: this.state.name,
                            associateLevel: this.state.associateLevel,
                            programmingLanguages: this.state.programmingLanguages,
                            officeLocation: this.state.officeLocation,
                            description: this.state.description})
    })
    .then(response => response.json())
    .then(data=>{
        if(data === '"Req Created"'){
            alert("Created!");
            this.props.refreshData()
            this.handleClose()
        }
        else {
            alert("Error Creating Req!");
        }
    })
  }

  redirect = () => {
    this.props.history.push('/Login');
  }

  handleChange = name => event => {
    this.setState({
        [name]: event.target.value,
    });
};

  render() {
    const { classes } = this.props;

    return (
      <Router> 
      <div>
        <Modal
          style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.open}
          onClose={this.handleClose}
        >
            <Grid item  xs={10} sm={8} md={4} lg={4} style={{textAlign: 'center', margin: 'auto', display: 'flex'}}>
            <Card>
                <CardHeader title="New Req"/>
                <form style={{marginLeft: 10, marginBottom: 10, marginRight: 10}} id="form" className="form" onSubmit={this.createReq}>
                
                    <TextField
                        style={{width: '85%', marginTop: '2%'}}
                        label="Req Name"
                        id="reqName" 
                        value={this.state.last_name}
                        onChange={this.handleChange('name')}
                        variant="outlined"
                        error={this.state.reqNameError ? true : false}
                    />

                    <FormControl variant="outlined" className={classes.formControl} style={{width: '85%', marginTop: '2%'}}>
                        <InputLabel htmlFor="OfficeLocation">Office Location</InputLabel>
                        <Select
                            value={this.state.officeLocation}
                            onChange={this.handleChange('officeLocation')}
                            input={
                                <OutlinedInput
                                labelWidth={this.state.labelWidth}
                                name="OfficeLocation"
                                id="officeLocation"
                                />
                            }
                            error={this.state.officeLocationError ? true : false}
                        >
                            <MenuItem value={"New York"}>New York</MenuItem>
                            <MenuItem value={"Arlington"}>Arlington</MenuItem>
                            <MenuItem value={"San Fransisco"}>San Fransisco</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" className={classes.formControl} style={{width: '85%', marginTop: '2%'}}>
                        <InputLabel htmlFor="AssociateLevel">Associate Level</InputLabel>
                        <Select
                            value={this.state.associateLevel}
                            onChange={this.handleChange('associateLevel')}
                            input={
                                <OutlinedInput
                                labelWidth={this.state.labelWidth}
                                name="AssociateLevel"
                                id="associateLevel"
                                />
                            }
                            error={this.state.associateLevelError ? true : false}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" className={classes.formControl} style={{width: '85%', marginTop: '2%'}}>
                        <InputLabel htmlFor="Programming Languages">Programming Languages</InputLabel>
                        <Select
                            multiple
                            value={this.state.programmingLanguages}
                            onChange={this.handleChange('programmingLanguages')}
                            input={
                                <OutlinedInput
                                labelWidth={this.state.labelWidth}
                                name="ProgrammingLanguages"
                                id="programmingLanguages"
                                />
                            }
                            error={this.state.programmingLanguagesError ? true : false}
                        >
                            {programmingLanguages.map(programmingLanguage => (
                                <MenuItem key={programmingLanguage} value={programmingLanguage}>
                                    {programmingLanguage}
                                </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <TextField
                        style={{width: '85%', marginTop: '2%'}}
                        label="Req Description"
                        id="description" 
                        value={this.state.description}
                        onChange={this.handleChange('description')}
                        variant="outlined"
                        multiline
                        error={this.state.descriptionError ? true : false}
                    />

                    <FormControl className={classes.formControl}>
                        <div style={{textAlign: "center"}}>
                            <Button id="register" className={classes.button} onClick={this.handleClose} type="submit" style={{width: '33%',color: 'white', backgroundColor: '#3f51b5', marginRight: '1%'}}>
                                Cancel
                            </Button>
                            <Button id='login' className={classes.button} onClick={this.createReq} style={{width: '33%',color: 'white', backgroundColor: '#3f51b5'}}>
                                Create
                            </Button>
                        </div>
                    </FormControl>
                </form>
            </Card>
            </Grid>
        </Modal>
      </div>
      </Router> 
    );
  }
}

const ReqModalWrapped = withStyles(styles)(ReqModal);
const ReqModalWrappeddWithRouter = withRouter(ReqModalWrapped)
export default ReqModalWrappeddWithRouter;