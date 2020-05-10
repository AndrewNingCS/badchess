import React from 'react';
import Typography from '@material-ui/core/Typography';
import SideBar from './SideBar';
import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import TwoPlayer from './TwoPlayer'
import makeCall from './MakeCall'

const poll_interval = 3 // in seconds

class Create extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameID: 0,
            playerID: "",
            roomCode: "",
            roomLink: "",
            playerJoined: false,
            gameStarted: false
        }
    }

    onClickStart() {
        let data = JSON.stringify({
            game_id: this.state.gameID,
            player_id: this.state.playerID
        })
        makeCall("start_two_player_game", "POST", data)
            .then(res => res.json())
            .then(result => {
                // returns a GAME STATE JSON object
                this.setState({
                    gameStarted: result.game_started
                })
                clearInterval(this.timer);
                this.timer = null; // stop polling once the game starts
            })
    }

    componentDidMount() {
        makeCall("create_two_player_game", "GET")
            .then(res => res.json())
            .then(result => {
                this.setState({
                    gameID: result.game_id,
                    playerID: result.player_id,
                    roomCode: result.room_code,
                    roomLink: result.room_link
                })
            })
            .then(() => {
                // poll server every few seconds
                this.timer = setInterval(() => this.pollServer(), 1000 * poll_interval);
            })
    }

    // called when the back button is pressed or when tab is closed
    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null; // stop polling if user leaves the page

        let data = JSON.stringify({
            game_id: this.state.gameID,
            player_id: this.state.playerID
        })
        makeCall("leave_two_player_game", "POST", data)
    }

    pollServer() {
        let data = JSON.stringify({
            game_id: this.state.gameID,
            player_id: this.state.playerID
        })
        makeCall("has_player_joined", "POST", data)
            .then(res => res.json())
            .then(result => {
                // returns a JOINED JSON object with one field: joined
                this.setState({
                    playerJoined: result.joined
                })
            })
    }
    
    render() {
        if (this.state.gameStarted) {
            return (
                <TwoPlayer
                    playerNumber={1}
                    gameID={this.state.gameID}
                    playerID={this.state.playerID}
                />
            );
        } else {
            let buttonDisabled = !this.state.playerJoined;
            let p2ConnectedText = this.state.playerJoined ? "Player 2" : "";
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
                            <Button
                                style={{textTransform: 'none', backgroundColor: "#F0EBD8"}}
                                variant="contained"
                                disabled={buttonDisabled}
                                onClick={() => this.onClickStart()}
                            >
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
                            <hr/>
                            <Typography style={{}} variant="h4">
                                Players Connected:
                            </Typography>
                            <Typography style={{}} variant="body1">
                                Player 1
                            </Typography>
                            <br/>
                            <Typography style={{}} variant="body1">
                                {p2ConnectedText}
                            </Typography>
                        </Container>
                    </div>
                </div>
            )
        }
    }
  }

  export default Create