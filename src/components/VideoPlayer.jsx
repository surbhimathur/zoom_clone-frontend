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
      [theme.breakpoints.down('md')]: {
        width: '100%',
        height:'auto'
      },
      
    },
    hideVideo: {
      display:'none',
      
    },
    gridContainer: {
      
      justifyContent: 'center',
      
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    paper: {
      padding: '10px',
      border: '2px solid black',
      margin: '20px',
      [theme.breakpoints.down('xs')]: {
        width: 'auto',
        margin: '20px',
      },
      // [theme.breakpoints.between('sm','md')]: {
      //   width: '75%',
      // },
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
      objectFit:'cover',
      [theme.breakpoints.down('xs')]: {
        width: '200px',
        height:'200px'

      },
    },
    videoAvatarContainer:{
      display: 'flex',
      alignItems: 'center',
      width: '550px',
      border:'2px solid red',
     position:'relative',
     [theme.breakpoints.down('sm')]: {
      width: 'auto'
    },
    // [theme.breakpoints.between('sm','md')]: {
    //   width: '100%',
    // }
    },
    avatarbox:{
      [theme.breakpoints.down('lg')]: {
        width: '100%',
      
      },
      // [theme.breakpoints.between('sm','md')]: {
      //   width: '100%',
      // }
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
            <Grid item xs={12} sm={12}>
                <Typography variant="h5" gutterBottom>
                {name || 'Name'}
                {console.log('my name is:',name)}
                </Typography>
                <div className={classes.videoAvatarContainer}>
                <video playsInline muted ref={myVideo} autoPlay className={classes.video} style={{
                opacity: `${myVdoStatus ? "1" : "0"}`,}}/>
                <div className={classes.avatarbox} style={{ 
                border:'1px solid blue',
                background: 'linear-gradient(to right, #800080, #ffc0cb)', 
                opacity: `${myVdoStatus ? "-1" : "2"}`,
                display:'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                // width:'550px',
                position:'absolute',
                top:0,
                bottom:0
               
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
                <div className={classes.avatarbox} style={{ 
                border:'1px solid blue',
                background: 'linear-gradient(to right, #800080, #ffc0cb)', 
                opacity: `${userVdoStatus ? "-1" : "2"}`,
                display:'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                width:'100%',
                position:'absolute',
                
                
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