import React from 'react';
import Typography from '@material-ui/core/Typography';
import SideBar from './SideBar';
import TextField from '@material-ui/core/TextField';
import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";

function Join() {
    return (
      <div className="Join" style={{width: "100%", height: "100vh", backgroundColor: "#748CAB"}}>
        <SideBar/>
        <div style={{marginLeft: "12vw"}}>
            <Typography style={{paddingTop: "75px", fontSize:"5rem"}} align="center">
                Room Code
            </Typography>
            <Container align="center" maxWidth="xs">
                <TextField style={{background: "white"}} variant="outlined" label="" />
                <div style={{paddingTop: "25px"}}/>
                <Button style={{textTransform: 'none', backgroundColor: "#F0EBD8"}} variant="contained">
                    <Typography variant="h3">
                        Join
                    </Typography>
                </Button>
                <div style={{display: "inline-block", paddingLeft: "25px"}}/>
                <Button component={Link} to="/" style={{textTransform: 'none', backgroundColor: "#F0EBD8"}} variant="contained">
                    <Typography variant="h3">
                        Back
                    </Typography>
                </Button>
            </Container>
        </div>
      </div>
    );
  }

  export default Join