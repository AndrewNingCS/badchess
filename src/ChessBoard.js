import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardActionArea from '@material-ui/core/CardActionArea';
import React from 'react';
import makeCall from './MakeCall'

import blackKing from './imgs/black_king.png'; // http://clipart-library.com/clipart/pcqrGKzLi.htm
import whiteKing from './imgs/white_king.png';
import blackQueen from './imgs/black_queen.png';
import whiteQueen from './imgs/white_queen.png';
import blackBishop from './imgs/black_bishop.png';
import whiteBishop from './imgs/white_bishop.png';
import blackHorse from './imgs/black_horse.png';
import whiteHorse from './imgs/white_horse.png';
import blackRook from './imgs/black_rook.png';
import whiteRook from './imgs/white_rook.png';
import blackPawn from './imgs/black_pawn.png';
import whitePawn from './imgs/white_pawn.png';


const numRows = 8;
const numCols = 8;
const dark = "#F1AD79";
const light = "#F0EBD8";
const blockWidth = "100%";
const blockHeight = "100%";


class Block extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            x: this.props.coordinate[0],
            y: this.props.coordinate[1],
            image: "",
        }

        let piece = this.props.boardState[0];
        let isWhite = this.props.boardState[1];
        let image = "";
        if (piece === "K") {
            image = isWhite ? whiteKing : blackKing;
        } else if (piece === "Q") {
            image = isWhite ? whiteQueen : blackQueen;
        } else if (piece === "B") {
            image = isWhite ? whiteBishop : blackBishop;
        } else if (piece === "H") {
            image = isWhite ? whiteHorse : blackHorse;
        } else if (piece === "R") {
            image = isWhite ? whiteRook : blackRook;
        } else if (piece === "P") {
            image = isWhite ? whitePawn : blackPawn;
        }

        this.state.piece = piece;
        this.state.isWhite = isWhite;
        this.state.image = image;
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onCustomClick(this.state);
    }

    componentDidUpdate(prevProps){
        if (prevProps.boardState !== this.props.boardState) {
            let piece = this.props.boardState[0];
            let isWhite = this.props.boardState[1];
            let image = "";
            if (piece === "K") {
                image = isWhite ? whiteKing : blackKing;
            } else if (piece === "Q") {
                image = isWhite ? whiteQueen : blackQueen;
            } else if (piece === "B") {
                image = isWhite ? whiteBishop : blackBishop;
            } else if (piece === "H") {
                image = isWhite ? whiteHorse : blackHorse;
            } else if (piece === "R") {
                image = isWhite ? whiteRook : blackRook;
            } else if (piece === "P") {
                image = isWhite ? whitePawn : blackPawn;
            }

            this.setState({piece: piece});
            this.setState({isWhite: isWhite});
            this.setState({image: image});
        }
    }

    render() {
        let focus = this.props.isSelected ? "2px solid #3E5C76" : "";
        if (this.state.image === "") {
            return (   
                <Card
                    square
                    key={this.state.x}
                    style={{width: "12.5%"}}
                >     
                    <CardActionArea
                        style={{
                            width: blockWidth,
                            height: blockHeight,
                            backgroundColor: this.props.colour,
                            border: focus
                        }}
                        onClick={() => this.handleClick()}
                        disableRipple
                    />
                </Card>
            )
        }
        return (
            <Card
                square
                key={this.state.x}
                onClick={() => this.handleClick()}
                style={{width: "12.5%"}}
            >
                <CardActionArea
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        width: blockWidth,
                        height: blockHeight,
                        backgroundColor: this.props.colour,
                        border: focus
                    }}
                    disableRipple
                >
                    <img
                        style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "80%",
                            height: "80%"
                        }}
                        src={this.state.image}
                        alt={this.state.piece}
                    />
                </CardActionArea>
            </Card>
        )
    }
}

class ChessBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            isSelected: false,
            selectedCoordinate: [],
            isSinglePlayer: this.props.isSinglePlayer,
            playerNumber: this.props.playerNumber
        }

        if (!this.props.isSinglePlayer) {
            this.state.gameID = this.props.gameID;
            this.state.playerID = this.props.playerID;
        }

        this.handleClick = this.handleClick.bind(this);
    }

    processJSON(){
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
                    boardState: [this.state.gameState.board[y][x][0], this.state.gameState.board[y][x][1]]
                }
                row.push(cardSpecs);
            }
            board.push(row);
        }
        this.setState({ board: board });
    }

    handleClick(blockState) {
        let x = blockState.x;
        let y = blockState.y;
        let piece = blockState.piece;
        let isWhite = blockState.isWhite;
        console.log(`${x}, ${y}, ${piece}, ${isWhite}`);
        if (piece === "N" && !this.state.isSelected) {
            return;
        }
        if (this.checkSelected(x,y)){
            this.setState({isSelected: false});
            this.setState({selectedCoordinate: []});
        } else {
            if (this.state.isSelected){ // release piece
                let oldCoordinate = this.state.selectedCoordinate;
                this.setState({isSelected: false});
                this.setState({selectedCoordinate: []});
                if (this.state.isSinglePlayer) {
                    let data = JSON.stringify({
                        gameID: this.state.gameState.gameID,
                        moveFrom: oldCoordinate,
                        moveTo: [x,y]
                    })
                    makeCall("single_player_move", "POST", data)
                        .then(res=>res.json())
                        .then(result => this.setState({gameState: result}))
                        .then(() => {
                            this.processJSON();
                        })
                } else {
                    // this is here the make move, then wait for move logic will be
                    let data = JSON.stringify({
                        gameID: this.state.gameState.gameID,
                        playerID: this.state.playerID,
                        moveFrom: oldCoordinate,
                        moveTo: [x,y]
                    })
                    makeCall("make_move", "POST", data)
                        .then(res => res.json())
                        .then(result => {
                            this.setState({gameState: result});
                            return result
                        })
                        .then(result => {
                            this.processJSON();
                            return result
                        })
                        .then(result => {
                            // if the move was valid, we wait for the next move
                            if (!result.invalidMove) {
                                let data = JSON.stringify({
                                    gameID: this.state.gameState.gameID,
                                    playerID: this.state.playerID
                                })
                                makeCall("wait_for_move", "POST", data)
                                    .then(res => res.json())
                                    .then(result => {
                                        this.setState({gameState: result});
                                    })
                                    .then(() => {
                                        this.processJSON();
                                    })
                            }
                        })
                }
            } else {
                this.setState({isSelected: true});
                this.setState({selectedCoordinate: [x,y]});
            }
        }
    }

    componentDidMount() {
        if (this.state.isSinglePlayer) {
            makeCall("create_single_player_game", "GET")
                .then(res => res.json())
                .then(result => this.setState({ gameState: result }))
                .then(() => {
                    this.processJSON();
                    this.setState({ loaded: true });
                })
        } else {
            let data = JSON.stringify({
                gameID: this.state.gameID,
                playerID: this.state.playerID
            })
            makeCall("has_game_started", "POST", data)
                .then(res => res.json())
                .then(result => {
                    this.setState({ 
                        gameState: result
                    }, this.processJSON);
                    this.setState({ loaded: true });
                })
                .then(() => {
                    // If playernumber is 2, game starts off by waiting for a move
                    if (this.state.playerNumber === 2) {
                        let data = JSON.stringify({
                            gameID: this.state.gameID,
                            playerID: this.state.playerID
                        })
                        makeCall("wait_for_move", "POST", data)
                            .then(res => res.json())
                            .then(result => {
                                this.setState({
                                    gameState: result
                                }, this.processJSON);
                            })
                    }
                })
        }
    }

    componentWillUnmount() {
        let data = JSON.stringify({
            gameID: this.state.gameID,
            playerID: this.state.playerID
        })
        makeCall("leave_two_player_game", "POST", data)
    }

    checkSelected(x,y){
        return this.state.isSelected && this.state.selectedCoordinate[0] === x
            && this.state.selectedCoordinate[1] === y;
    }

    render() {
        if (this.state.loaded) {
            return(
                <Grid container={true} style={{height: "88vmin", width: "88vmin"}}>
                    {this.state.board.map((x, i) => (
                        <Grid container key={i} style={{width: "100%", height: (100/numRows) + "%"}}>
                            {x.map(x => (
                                <Block
                                    key={x.key}
                                    coordinate={x.coordinate}
                                    colour={x.colour}
                                    boardState={x.boardState}
                                    onCustomClick={this.handleClick}
                                    isSelected={this.checkSelected(x.coordinate[0], x.coordinate[1])}
                                />
                            ))}
                        </Grid>
                    ))}
                </Grid>
            )
        } else {
            return (
                <div>
                    Loading from Server
                </div>
            )
        }
    }
}


export default ChessBoard