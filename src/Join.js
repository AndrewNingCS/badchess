import React from 'react';
import Typography from '@material-ui/core/Typography';
import SideBar from './SideBar';
import TextField from '@material-ui/core/TextField';
import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import TwoPlayer from './TwoPlayer'

const poll_interval = 3 // in seconds

class Join extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameID: 0,
            playerID: "",
            roomCode: "",
            joined: false
        }

        this.timer = null;
    }

    onClickJoin() {
        fetch("http://badchess-server.herokuapp.com/join_two_player_game", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                room_code: this.state.roomCode
            })
        })
            .then(res => res.json())
            .then(result => {
                this.setState({
                    gameID: result.game_id,
                    playerID: result.player_id,
                    joined: true,
                    gameStarted: false,
                    gameState: null
                })
                console.log(result);
                // poll the server to see if the game started
                this.timer = setInterval(() => this.pollServer(), 1000 * poll_interval);
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
            fetch("http://badchess-server.herokuapp.com/leave_two_player_game", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    game_id: this.state.gameID,
                    player_id: this.state.playerID
                })
            })
        }
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    pollServer() {
        console.log(this.state.gameID);
        console.log(this.state.playerID);
        fetch("http://badchess-server.herokuapp.com/has_game_started", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                game_id: this.state.gameID,
                player_id: this.state.playerID
            })
        })
            .then(res => res.json())
            .then(result => {
                // returns a game state JSON object
                this.setState({
                    gameStarted: result.game_started,
                    gameState: result
                })
                if (result.game_started) {
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