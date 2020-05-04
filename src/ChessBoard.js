import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardActionArea from '@material-ui/core/CardActionArea';
import React from 'react';

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
const dark = "#F1AD79";
const light = "#F0EBD8";
const blockWidth = "100px";
const blockHeight = "100px";


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
                <CardActionArea
                    key={this.state.x}
                    style={{
                        width: blockWidth,
                        height: blockHeight,
                        backgroundColor: this.props.colour,
                        border: focus
                    }}
                    onClick={() => this.handleClick()}
                    disableRipple
                />
            )
        }
        return (
            <Card
                square
                key={this.state.x}
                onClick={() => this.handleClick()}
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
            selectedCoordinate: []
        }

        this.handleClick = this.handleClick.bind(this);
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
                let boardCopy = JSON.parse(JSON.stringify(this.state.board));
                boardCopy[y][x]['boardState'] = [boardCopy[oldCoordinate[1]][oldCoordinate[0]]['boardState'][0], boardCopy[oldCoordinate[1]][oldCoordinate[0]]['boardState'][1]];
                boardCopy[oldCoordinate[1]][oldCoordinate[0]]['boardState'] = ["N", true];
                this.setState({isSelected: false});
                this.setState({selectedCoordinate: []});
                this.setState({board: boardCopy});
            } else {
                this.setState({isSelected: true});
                this.setState({selectedCoordinate: [x,y]});
            }
        }
    }

    componentDidMount() {
        fetch("https://badchess-server.herokuapp.com/create_single_player_game")
            .then(res => res.json())
            .then(result => this.setState({ gameState: result }))
            .then(() => {
                let board = [];
                for (let y = 0; y < numRows; y++) {
                    let row = [];
                    let parity = y % 2 === 0 ? 0 : 1;
                    for (let x = 0; x < numRows; x++) {
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
                this.setState({ loaded: true });
            })
    }

    checkSelected(x,y){
        return this.state.isSelected && this.state.selectedCoordinate[0] === x
            && this.state.selectedCoordinate[1] === y;
    }

    render() {
        console.log(this.state.board)
        if (this.state.loaded) {
            return(
                <Grid container={true}>
                    {this.state.board.map((x, i) => (
                        <Grid container key={i}>
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