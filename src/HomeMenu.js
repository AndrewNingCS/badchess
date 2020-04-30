import React from 'react';
import Button from '@material-ui/core/Button';
import { Container } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";

function HomeMenu(){
    return(
        <Container>
            <Container align="center" maxWidth="xs">
                <Button component={Link} to="singleplayer" style={{textTransform: 'none', backgroundColor: "#F0EBD8"}} fullWidth={true} variant="contained">
                    <Typography variant="h3">
                        Single Player
                    </Typography>
                </Button>
            </Container>
            <Container style={{paddingTop: "25px"}} align="center" maxWidth="xs">
                <Button style={{textTransform: 'none', backgroundColor: "#F0EBD8"}} fullWidth={true} variant="contained">
                    <Typography variant="h3">
                        Join a Room
                    </Typography>
                </Button>
            </Container>
            <Container style={{paddingTop: "25px"}} align="center" maxWidth="xs">
                <Button style={{textTransform: 'none', backgroundColor: "#F0EBD8"}} fullWidth={true} variant="contained">
                    <Typography variant="h3">
                        Create a Room
                    </Typography>
                </Button>
            </Container>
        </Container>
    )
}


export default HomeMenu