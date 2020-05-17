import Card from '@material-ui/core/Card';
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

const blockWidth = "100%";
const blockHeight = "100%";


class Block extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            x: this.props.coordinate[0],
            y: this.props.coordinate[1],
            piece: this.props.pieceData[0],
            isWhite: this.props.pieceData[1],
            image: this.getImage(this.props.pieceData),
            isPossible: this.props.isPossible,
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onCustomClick(this.state);
    }

    getImage(pieceData) {
        let piece = pieceData[0];
        let isWhite = pieceData[1];
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
        return image;
    } 

    componentDidUpdate(prevProps) {
        if (prevProps.pieceData !== this.props.pieceData) {
            let piece = this.props.pieceData[0];
            let isWhite = this.props.pieceData[1];
            let image = this.getImage(this.props.pieceData);

            this.setState({
                piece: piece,
                isWhite: isWhite,
                image: image
            })
        }
    }

    render() {
        let focus = "";
        if (this.props.isSelected) {
            focus = "2px solid #3E5C76";
        } else if (this.props.isPossible) {
            focus = "2px solid #3E5C76"; // TODO: pick another colour
        }
        let image = <img
            style={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "80%",
                height: "80%"
            }}
            src={this.state.image}
            alt={this.state.piece}
        />
        if (this.state.image === "") {
            image = null;
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
                    {image}
                </CardActionArea>
            </Card>
        )
    }
}


export default Block