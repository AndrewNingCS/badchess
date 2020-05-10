import React from 'react';
import Typography from '@material-ui/core/Typography';
import SideBar from './SideBar';
import TextField from '@material-ui/core/TextField';
import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import TwoPlayer from './TwoPlayer'
import makeCall from './MakeCall'

const pollInterval = 3 // in seconds

class Join extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameID: 0,
            playerID: "",
            roomCode: "",
            joined: false,
            gameStarted: false
        }

        this.timer = null;
    }

    onClickJoin() {
        let data = JSON.stringify({
            roomCode: this.state.roomCode
        })
        makeCall("join_two_player_game", "POST", data)
            .then(res => res.json())
            .then(result => {
                this.setState({
                    gameID: result.gameID,
                    playerID: result.playerID,
                    joined: true,
                    gameStarted: false
                })
                // poll the server to see if the game started
                this.timer = setInterval(() => this.pollServer(), 1000 * pollInterval);
            })
    }

    onTextFieldChange = (e) => {
        this.setState({
            roomCode: e.target.value
        });
    }

    // called when the back button is pressed or when tab is closed
    componentWillUnmount() {
        if (this.state.joined) {
            let data = JSON.stringify({
                gameID: this.state.gameID,
                playerID: this.state.playerID
            })
            makeCall("leave_two_player_game", "POST", data)
        }
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    pollServer() {
        let data = JSON.stringify({
            gameID: this.state.gameID,
            playerID: this.state.playerID
        })
        makeCall("has_game_started", "POST", data)
            .then(res => res.json())
            .then(result => {
                // returns a game state JSON object
                this.setState({
                    gameStarted: result.gameStarted
                })
                if (result.gameStarted) {
                    // clear the timer
                    clearInterval(this.timer);
                    this.timer = null;
                }
            })
    }

    render() {
        if (this.state.gameStarted) {
            return (
                <TwoPlayer
                    playerNumber={2}
                    gameID={this.state.gameID}
                    playerID={this.state.playerID}
                />
            );
        } else {
            let buttonDisabled = this.state.roomCode === "";
            let joinedText = this.state.joined ? "Joined Game! Wait for host to start." : ""
            return (
                <div className="Join" style={{width: "100%", height: "100vh", backgroundColor: "#748CAB"}}>
                    <SideBar/>
                    <div style={{marginLeft: "12vw"}}>
                        <Typography style={{paddingTop: "75px", fontSize:"5rem"}} align="center">
                            Room Code
                        </Typography>
                        <Container align="center" maxWidth="xs">
                            <TextField
                                style={{background: "white"}}
                                variant="outlined"
                                label=""
                                onChange={this.onTextFieldChange}
                            />
                            <div style={{paddingTop: "25px"}}/>
                            <Button 
                                style={{textTransform: 'none', backgroundColor: "#F0EBD8"}}
                                variant="contained"
                                onClick={() => this.onClickJoin()}
                                disabled={buttonDisabled}
                            >
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
                        <Typography style={{}} variant="h4" align="center">
                            {joinedText}
                        </Typography>
                    </div>
                </div>
            );
        }
    }
}

export default Join