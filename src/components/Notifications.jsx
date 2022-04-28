import React,{useContext} from 'react'

import {Button} from '@material-ui/core';
import {SocketContext} from '../SocketContext';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
user:{
  [theme.breakpoints.down('xs')]: {
    fontSize:'20px',
  },
},
pickupcall:{
  [theme.breakpoints.down('xs')]: {
    width:'auto'  
  }, 
}
}));
const Notifications = () => {
  const {answerCall,call,callAccepted} = useContext(SocketContext);
  const classes=useStyles();
 
  return (
    <>
      {call?.isReceivedCall && !callAccepted && (
        <div style={{display:'flex',justifyContent: 'center'}}>
        <h1 className={classes.user}>{call.name} is calling:</h1>
        <Button className={classes.pickupcall} variant="contained" color="primary" onClick={answerCall}>
         Answer
        </Button> 
        </div>
      )}
    </>
  );
}

export default Notifications