import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import{FaVideo, FaVideoSlash} from "react-icons/fa";
import {Grid, Paper, Typography} from '@material-ui/core';
import React,{useContext, useEffect, useState} from 'react';

import {SocketContext} from '../SocketContext';
import avatar from "../../src/avatar.png";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    video: {
      display:'block',
      width: '550px',
      [theme.breakpoints.down('xs')]: {
        width: '300px',
      },
    },
    hideVideo: {
      display:'none',
      
    },
    gridContainer: {
      border:'1px solid yellow',
      justifyContent: 'center',
      
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    paper: {
      padding: '10px',
      border: '2px solid black',
      margin: '10px',
     
    },
    buttons:{
      
      display:'flex',
      flexDirection:'row',
     margin:'10px 0px',
     alignItems: 'center',
     justifyContent: 'space-evenly',
   
    },
    icons:{
      fontSize:'35px',
      
    },
    avatar:{
      width:'300px',
      height:'300px',
      
    },
    videoAvatarContainer:{
      display: 'flex',
      alignItems: 'center',
      width: '550px',
      border:'1px solid red',
     position:'relative'
    }
  }));

  
const VideoPlayer = () => {
    const {name,callAccepted,myVideo,userVideo,callEnded,stream,call,updateMic,myMicStatus,updateVideo,
      myVdoStatus,userVdoStatus,userMicStatus}=useContext(SocketContext);
    const classes=useStyles();
    

  return (
    <Grid container className={classes.gridContainer}>
        {/*our own video*/}
        {
            stream && (
        
        <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                {name || 'Name'}
                {console.log('my name is:',name)}
                </Typography>
                <div className={classes.videoAvatarContainer}>
                <video playsInline muted ref={myVideo} autoPlay className={classes.video} style={{
                opacity: `${myVdoStatus ? "1" : "0"}`,}}/>
                <div style={{ 
                border:'1px solid blue',
                background: 'linear-gradient(to right, #800080, #ffc0cb)', 
                opacity: `${myVdoStatus ? "-1" : "2"}`,
                display:'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                width:'100%',
                position:'absolute',
                height:'400px'
                
              }}
              ><img src={avatar} className={classes.avatar} alt="avatar"/>
              </div>
              </div>
            </Grid>
            <div className={classes.buttons}>
            <button onClick={()=>updateMic()} >{myMicStatus?(<BsMicFill className={classes.icons} />):(<BsMicMuteFill className={classes.icons} />)}</button>
            <button onClick={()=>updateVideo()} >{myVdoStatus?(<FaVideo className={classes.icons} />):(<FaVideoSlash className={classes.icons} />)}</button>
            </div> 
        </Paper>
            )}
        {/* users video*/}
        {
            callAccepted && !callEnded && (
        
        <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                {call.name || 'Name'}
                {console.log('users name is',call.name)}
                </Typography>
                <div className={classes.videoAvatarContainer}>
                <video playsInline ref={userVideo} autoPlay className={classes.video} style={{
                opacity: `${userVdoStatus ? "1" : "0"}`,}}/>
                <div style={{ 
                border:'1px solid blue',
                background: 'linear-gradient(to right, #800080, #ffc0cb)', 
                opacity: `${userVdoStatus ? "-1" : "2"}`,
                display:'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                width:'100%',
                position:'absolute',
                height:'400px'
                
              }}
              ><img src={avatar} className={classes.avatar} alt="avatar"/>
              </div>
                </div>
            </Grid>
            
        </Paper>
            )}
           
    </Grid>
    
  );
};

export default VideoPlayer