import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Container } from '@material-ui/core';
import HomeMenu from './HomeMenu'

function Home() {
    return (
      <div className="Home" style={{width: "100%", height: "100vh", backgroundColor: "#748CAB"}}>
            <Typography style={{paddingTop: "75px", fontSize:"10rem"}} align="center">
                Bad Chess
            </Typography>
            <Container style={{paddingTop: "50px"}}/>
            <HomeMenu/>
      </div>
    );
  }

  export default Home