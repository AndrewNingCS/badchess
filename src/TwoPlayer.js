import React from 'react';
import ChessBoard from './ChessBoard';
import SideBar from './SideBar';
import makeCall from './MakeCall'


const numRows = 8;
const numCols = 8;
const dark = "#F1AD79";
const light = "#F0EBD8";

class TwoPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            gameState: null,
            board: null,
            playerNumber: this.props.playerNumber,
            playerID: this.props.playerID,
            gameID: this.props.gameID,
            ourTurn: false
        }

        this.makeMove = this.makeMove.bind(this);
    }

    processJSON() {
        let board = [];
        for (let y = 0; y < numRows; y++) {
            let row = [];
            let parity = y % 2 === 0 ? 0 : 1;
            for (let x = 0; x < numCols; x++) {
                let blockColour = x % 2 === parity ? light : dark;
                var cardSpecs = {
                    key: x.toString() + y.toString(),
                    coordinate: [x,y],
                    colour: blockColour,
                    pieceData: [
                        this.state.gameState.board[y][x][0],
                        this.state.gameState.board[y][x][1],
                        this.state.gameState.possibleMoves[y][x],
                    ]
                }
                row.push(cardSpecs);
            }
            board.push(row);
        }
        this.setState({
			board: board,
			loaded: true
		});
    }

    waitMove() {
        let wait = new EventSource(
            "https://badchess-server.herokuapp.com/wait_for_move",
            { withCredentials: true }
        );
        wait.addEventListener('message', (e) => {
            let data = JSON.parse(e.data)
            console.log(data);
            if (data.playerTurn === this.state.playerNumber) {
                this.setState({
                    gameState: data
                }, this.processJSON);
            }
        });
        wait.addEventListener('close', function(e) {
            console.log("Closing wait connection")
            wait.close();
        })
    }

    makeMove(moveData) {
        if (this.state.gameState.playerTurn === this.state.playerNumber) {
            let data = JSON.stringify({
                gameID: this.state.gameID,
                playerID: this.state.playerID,
                moveFrom: moveData.moveFrom,
                moveTo: moveData.moveTo
            })
            makeCall("make_move", "POST", data)
                .then(res => res.json())
                .then(result => {
                    this.setState({
                        gameState: result
                    }, this.processJSON);
                    // if the move was valid, we wait for the next move
                    if (!result.invalidMove) {
                        this.waitMove();
                    }
                })
        }
    }

    componentDidMount() {
        let data = JSON.stringify({
            gameID: this.state.gameID,
            playerID: this.state.playerID
        })
        makeCall("get_two_player_game_data", "POST", data)
            .then(res => res.json())
            .then(result => {
                this.setState({ 
                    gameState: result
                }, this.processJSON);
            })
            .then(() => {
                // If playernumber is 2, game starts off by waiting for a move
                if (this.state.playerNumber === 2) {
                    this.waitMove();
                }
            })
    }

    render() {
        // TODO: Create a loading display component
        let display = "Loading from server";
        if (this.state.loaded) {
            display = <ChessBoard
                board={this.state.board}
                onMovePiece={this.makeMove}
            />
        }
        return (
            <div
            className="TwoPlayer"
            style={{
                width: "100%",
                position: "relative",
                overflow: "hidden",
                height: "100vh",
                backgroundColor: "#748CAB"
            }}>
                <SideBar/>
                <div style={{marginLeft: "15vw"}}>
                    {display}
                </div>
            </div>
        )
    }
  
}



  export default TwoPlayer