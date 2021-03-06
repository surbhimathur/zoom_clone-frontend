import{Assignment, Phone, PhoneDisabled} from '@material-ui/icons';
import {Button, Container, Grid, Paper, TextField, Typography} from '@material-ui/core';
import React ,{useContext, useState}from 'react'

import { CopyToClipboard } from 'react-copy-to-clipboard';
import {SocketContext} from '../SocketContext';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    width: '100%',
   
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  container: {
    width: '600px',
    margin: '35px 0',
    padding: 0,
    
   
    [theme.breakpoints.down('xs')]: {
      width: '85%',
    },
    [theme.breakpoints.between('sm','md')]: {
      width: '75%',
      
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: '10px 20px',
    border: '2px solid black',
  },
  labelRoot: {
    lineHeight:1.5,
  }
 }));

 //options component for making a call to another user. Have to enter username and id for calling purpose.
const Options = ({children}) => {
  const {me,callAccepted,name,setName,callEnded,leaveCall,callUser}=useContext(SocketContext);
  const [idToCall,setIdToCall]=useState('');
  const classes=useStyles();
  return (
    <Container className={classes.container}>
    <Paper elevation={10} className={classes.paper}>
      <form className={classes.root} noValidate autoComplete="off">
        <Grid container className={classes.gridContainer}>
          <Grid item xs={12} md={6} className={classes.padding}>
            <Typography gutterBottom variant="h6">Account Info</Typography>
            <TextField label="Name" value={name} variant="standard" onChange={(e)=>setName(e.target.value)} fullWidth  InputLabelProps={{
          classes: {
            root: classes.labelRoot,
          }
        }}/>
         
          <CopyToClipboard text={me} className={classes.margin}>
            <Button variant="contained" color="primary" fullWidth startIcon={<Assignment fontSize="large"/>}>
              Copy Your ID
            </Button>
          </CopyToClipboard>
          </Grid>
          
          <Grid item xs={12} md={6} className={classes.padding}>
            <Typography gutterBottom variant="h6">Make A Call</Typography>
            <TextField label="ID to Call" value={idToCall} onChange={(e)=>setIdToCall(e.target.value)} fullWidth InputLabelProps={{
          classes: {
            root: classes.labelRoot,
          }
        }}/>
            {callAccepted && !callEnded ?(
             <Button variant="contained" color="secondary" fullWidth startIcon={<PhoneDisabled fontSize="large"/>} onClick={leaveCall} className={classes.margin}>
               Hang Up
             </Button>
            ):(
               <Button  variant="contained" color="primary" fullWidth startIcon={<Phone fontSize="large"/>} onClick={()=>callUser(idToCall)} className={classes.margin} >
                 Call
               </Button>
            )}
          </Grid>
        </Grid>
      </form>  
      {children}
    </Paper>
     </Container>
    
    
  )
}

export default Options