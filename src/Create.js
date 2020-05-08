import React from 'react';
import Typography from '@material-ui/core/Typography';
import SideBar from './SideBar';
import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";

class Create extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomCode: "",
            roomLink: "",
        }
    }

    componentDidMount() {
        fetch("https://badchess-server.herokuapp.com/create_two_player_game")
        .then(res => res.json())
        .then(result => this.setState({roomCode: result.room_code, roomLink: result.room_link}))
    }
    
    render() {
        return (
            <div className="Create" style={{width: "100%", height: "100vh", backgroundColor: "#748CAB"}}>
                <SideBar/>
                <div style={{marginLeft: "12vw"}}>
                    <Container align="center">
                        <div style={{paddingTop: "150px"}}>
                            <Typography style={{display: "inline-block", paddingRight: "10px"}} variant="h3">
                                Room Code:
                            </Typography>
                            <Typography style={{background: "white", display: "inline-block", paddingRight: "10px"}} variant="h3">
                                {this.state.roomCode}
                            </Typography>
                        </div>
                        <div style={{paddingTop: "15px"}}>
                            <Typography style={{display: "inline-block", paddingRight: "10px"}} variant="h3">
                                Room Link:
                            </Typography>
                            <Typography style={{background: "white", display: "inline-block", paddingRight: "10px"}} variant="h3">
                                {this.state.roomLink}
                            </Typography>
                        </div>
                        <div style={{paddingTop: "25px"}}/>
                        <Button style={{textTransform: 'none', backgroundColor: "#F0EBD8"}} variant="contained">
                            <Typography variant="h3">
                                Start
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
        )
    }
  }

  export default Create