import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Info from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import { withRouter } from 'react-router-dom';

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
class Profile extends React.Component {
    state = {
        first_nameError: false,
        last_nameError: false,
        teamNameError : false,
        isManagerError : false,
        associateLevelError: false,
        officeLocationError : false, 
        managerError: false,
        firstName: '',
        lastName: '',
        associateLevel: '',
        officeLocation: '',
        teamName : '',
        isManager: false,
        programmingLanguages : [],
        manager: ''
      }


    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    componentWillReceiveProps = (nextProps) => {
        this.setState({configName: nextProps.configName})
    }

    save = (event) => {
        event.preventDefault();
        var data = this.validation();
        
        if(data == false){
            return;
        }

        fetch('/api/profile', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data=>{
            if(data === "Employee Profile Created"){
                alert("Saved!");
                this.props.refreshData()
                this.props.history.push('/Dashboard')
            }
            else {
                alert("Error Saving!");
            }
        })
    }

    validation = () => {
        let error = false;
        this.setState({first_nameError: false, last_nameError: false, teamNameError : false, isManagerError: false, managerError: false, associateLevelError: false, officeLocationError : false, programmingLanguagesError: false})        
        
        if(this.state.firstName === ''){
            this.setState({first_nameError: true})
            error = true;
        }

        if(this.state.lastName === ''){
            this.setState({last_nameError: true})
            error = true;
        }

        if(this.state.teamName === ''){
            this.setState({teamNameError: true})
            error = true;
        }

        if(this.state.isManager === ''){
            this.setState({isManagerError: true})
            error = true;
        }

        if(this.state.isManager === true && this.state.manager === ''){
            this.setState({managerError: true})
            error = true;
        }

        if(this.state.associateLevel === ''){
            this.setState({associateLevelError: true})
            error = true;
        }

        if(this.state.officeLocation === ''){
            this.setState({officeLocationError: true})
            error = true;
        }

        if(this.state.programmingLanguages.length === 0){
            this.setState({programmingLanguagesError: true})
            error = true;
        }

        if(this.state.isManager === true){
            this.state.manager = this.state.firstName + ' ' + this.state.lastName
        }

        var data = {
                    name: this.state.firstName + ' ' + this.state.lastName,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    teamName: this.state.teamName,
                    isManager: this.state.isManager,
                    associateLevel: this.state.associateLevel,
                    officeLocation: this.state.officeLocation,
                    programmingLanguages: this.state.programmingLanguages,
                    manager: this.state.manager
                    };

        if(error){
            return false
        }

        return data;
    }

    render() {
        const { classes } = this.props;
        

        return(
            <div style={{textAlign: 'center'}}>
                <Grid item  xs={10} sm={8} md={4} lg={4} style={{textAlign: 'center', margin: 'auto', marginTop: '5%'}}>
                    <Card>
                        <CardHeader title="Profile"/>
                        <form style={{marginLeft: 10, marginBottom: 10, marginRight: 10}} id="form" className="form" onSubmit={this.handleRegister}>
                            
                            <TextField
                                style={{width: '40%', marginTop: '2%', marginRight: '5%'}}
                                label="First Name"
                                id="first_name" 
                                value={this.state.first_name}
                                onChange={this.handleChange('firstName')}
                                variant="outlined"
                                error={this.state.first_nameError ? true : false}
                            />

                            <TextField
                                style={{width: '40%', marginTop: '2%'}}
                                label="Last Name"
                                id="last_name" 
                                value={this.state.last_name}
                                onChange={this.handleChange('lastName')}
                                variant="outlined"
                                error={this.state.last_nameError ? true : false}
                            />
                            
                            <FormControl variant="outlined" className={classes.formControl} style={{width: '40%', marginTop: '2%', marginRight: '5%'}}>
                                <InputLabel htmlFor="IsManager">I am a Manager</InputLabel>
                                <Select
                                    value={this.state.isManager}
                                    onChange={this.handleChange('isManager')}
                                    input={
                                        <OutlinedInput
                                        labelWidth={this.state.labelWidth}
                                        name="IsManager"
                                        id="isManager"
                                        />
                                    }
                                    error={this.state.isManagerError ? true : false}
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                style={{width: '40%', marginTop: '2%'}}
                                label="Team Name"
                                id="teamName" 
                                value={this.state.last_name}
                                onChange={this.handleChange('teamName')}
                                variant="outlined"
                                error={this.state.teamNameError ? true : false}
                            />

                            <TextField
                                style={{width: '85%', marginTop: '2%'}}
                                label="Manager Name"
                                id="manager" 
                                value={this.state.manager}
                                onChange={this.handleChange('manager')}
                                variant="outlined"
                                error={this.state.managerError ? true : false}
                                disabled={this.state.isManager}
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
                                    <MenuItem value={"Manager"}>Manager</MenuItem>
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

                            <FormControl className={classes.formControl}>
                                <div style={{textAlign: "center"}}>
                                    {/* <Button id="register" className={classes.button} onClick={this.save} type="submit" style={{width: '33%',color: 'white', backgroundColor: '#3f51b5', marginRight: '1%'}}>
                                        Cancel
                                    </Button> */}
                                    <Button id='Save' className={classes.button} onClick={this.save} style={{width: '33%',color: 'white', backgroundColor: '#3f51b5'}}>
                                        Save
                                    </Button>
                                </div>
                            </FormControl>
                        </form>
                    </Card>
                </Grid>
            </div>
        )
    }
}
  
const ProfileWrapped = withStyles(styles)(Profile);
const profileWrappedWithRouter = withRouter(ProfileWrapped)
export default profileWrappedWithRouter;