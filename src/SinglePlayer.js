import React from 'react';
import ChessBoard from './ChessBoard';
import SideBar from './SideBar';
import makeCall from './MakeCall';
import PlayerPanel from './PlayerPanel';


const numRows = 8;
const numCols = 8;
const dark = "#F1AD79";
const light = "#F0EBD8";

class SinglePlayer extends React.Component {
	constructor(props) {
        super(props);

		this.state = {
			loaded: false,
			gameState: null,
            board: null,
        }
        
        this.makeMove = this.makeMove.bind(this);
    }
    
    makeMove(moveData) {
        let data = JSON.stringify({
            gameID: this.state.gameState.gameID,
            moveFrom: moveData.moveFrom,
            moveTo: moveData.moveTo
        })
        makeCall("single_player_move", "POST", data)
            .then(res => res.json())
            .then(result => this.setState({
                gameState: result
            }, this.processJSON))
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
            loaded: true,
            winner: this.state.gameState.winner
		});
    }

	componentDidMount() {
		makeCall("create_single_player_game", "GET")
			.then(res => res.json())
			.then(result => {
				this.setState({
					gameState: result
				}, this.processJSON)
			})
	}

	componentWillUnmount() {
		let data = JSON.stringify({
            gameID: this.state.gameState.gameID
        })
        makeCall("leave_single_player_game", "POST", data)
	}

	render() {
        // TODO: Create a loading display component
        let display = "Loading from server";
        if (this.state.loaded) {
            display = <div>
                <div
                    style={{
                        marginLeft: "15vw",
                        float: "left",
                        marginRight: "15px"
                    }}
                >
                    <ChessBoard
                        board={this.state.board}
                        onMovePiece={this.makeMove}
                        winner={this.state.winner}
                    />
                </div>
                <div>
                    <div
                        style={{
                            marginBottom: "10px"
                        }}
                    >
                        <PlayerPanel
                            name="Player 2"
                            deadPieces={this.state.gameState.deadPieces.black}
                            isTurn={false}
                            opponent={true}
                        />
                    </div>
                    <div>
                        <PlayerPanel
                            name="Player 1"
                            deadPieces={this.state.gameState.deadPieces.white}
                            isTurn={true}
                            opponent={false}
                        />
                    </div>
                </div>
            </div>
        }
        return (
            <div
                className="SinglePlayer"
                style={{
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    height: "100vh",
                    backgroundColor: "#748CAB",
                    overflowY: "scroll",
                }}
            >
                <SideBar/>
                {display}
            </div>
        )
	}
}



export default SinglePlayer