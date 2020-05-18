import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
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

const deadIconRows = 2; // implies max 8 pieces per row
const maxIcons = 16;

class PlayerPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            isTurn: this.props.isTurn,
            icon: null, // TODO
            deadPieces: this.props.deadPieces,
            opponent: this.props.opponent,
        }
    }

    pieceToImage(piece) {
        if (piece[1]) {
            // white
            switch (piece[0]) {
                case "P":
                    return whitePawn;
                case "R":
                    return whiteRook;
                case "H":
                    return whiteHorse;
                case "B":
                    return whiteBishop;
                case "Q":
                    return whiteQueen;
                case "K":
                    return whiteKing;
                default:
                    console.log("Error, not a recognized piece");
            }
        } else {
            // black
            switch (piece[0]) {
                case "P":
                    return blackPawn;
                case "R":
                    return blackRook;
                case "H":
                    return blackHorse;
                case "B":
                    return blackBishop;
                case "Q":
                    return blackQueen;
                case "K":
                    return blackKing;
                default:
                    console.log("Error, not a recognized piece");
            }
        }
    }

    groupImages() {
        let count = 0;
        let piecesArray = [];
        for (let i = 0; i < deadIconRows; ++i) {
            let row = [];
            for (let j = 0; j < maxIcons / deadIconRows; ++j) {
                if (count >= this.state.deadPieces.length) {
                    break;
                }
                row.push(
                    <img
                        key={i.toString() + j.toString()}
                        style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "25px",
                            height: "25px"
                        }}
                        src={this.pieceToImage(this.state.deadPieces[count])}
                        alt="Black Queen"
                    />
                );
                count++;
            }
            piecesArray.push(row);
            if (count >= this.state.deadPieces.length) {
                break;
            }
        }

        return (
            <Grid
                container={true}
                style={{
                    // height: "88vmin",
                    // width: "88vmin"
                }}
            >
                {piecesArray.map((x, i) => (
                    <Grid
                        key={i}
                        style={{
                            width: "100%",
                            // height: (100/numRows) + "%"
                        }}
                    >
                        {x}
                    </Grid>
                ))}
            </Grid>
        )
    }

    componentDidUpdate(prevProps) {
        if (prevProps.deadPieces !== this.props.deadPieces) {
            this.setState({
                deadPieces: this.props.deadPieces

            })
        }
        if (prevProps.isTurn !== this.props.isTurn) {
            this.setState({
                isTurn: this.props.isTurn
                
            })
        }
    }

    render() {
        let turnText = "";
        if (this.state.opponent) {
            turnText = this.state.isTurn ? "Opponent's turn" : "Waiting for opponent";
        } else {
            turnText = this.state.isTurn ? "Your turn" : "Waiting for opponent";
        }
        return (
            <Card
                style={{
                    display: "flex",
                    width: "20vw",
                    height: "150px",
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        noWrap={true}
                    >
                        {this.state.name}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        gutterBottom={true}
                    >
                        {turnText}
                    </Typography>
                    {this.groupImages()}
                </CardContent>
            </Card>
        )
    }
}


export default PlayerPanel