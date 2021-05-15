import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

const styles = theme => ({
    root: {
      flexGrow: 1,
      padding: 10
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

class TeamCard extends React.Component {

    state={index: this.props.index,
           data: this.props.data}

    componentWillReceiveProps = (nextProps) => {
      //console.log(nextProps.data)
      this.setState({data: nextProps.data})
    }

    componentWillMount = () => {
      // this.getTeam();   
    }
    
    getEmail = () => {
      fetch('/api/team')
      .then(this.handleErrors)
      .then(response => response.json())
      .then(data=>{
          if(data){
              this.setState({data: data})
          }else{
              this.props.history.push('/Login');
              alert('Ran into an error, please login again.')
          }
      })
    }

    render() {
        const { classes } = this.props;

        return(
            <Card className={classes.Card}>
                <CardHeader title="Team"/>
            </Card>)
    }
}
  
const TeamCardWrapped = withStyles(styles)(TeamCard);

export default TeamCardWrapped;