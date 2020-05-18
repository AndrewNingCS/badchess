import Grid from '@material-ui/core/Grid';
import React from 'react';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import Block from './Block';


const numRows = 8;


class ChessBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSelected: false,
            selectedCoordinate: [],
            board: this.props.board,
            possibilities: this.noPossibilities()
        }

        this.handleClick = this.handleClick.bind(this);
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.board !== this.props.board) {
            this.setState({
                board: this.props.board
            })
        }
    }

    handleClick(blockState) {
        let x = blockState.x;
        let y = blockState.y;
        let piece = blockState.piece;
        let isWhite = blockState.isWhite;
        console.log(`${x}, ${y}, ${piece}, ${isWhite}`);
        if (piece === "N" && !this.state.isSelected) {
            // if first selecting a block with no piece, do nothing
            return;
        }
        if (this.checkSelected(x,y)) {
            // if selecting a piece twice, unselect it
            this.setState({
                isSelected: false,
                selectedCoordinate: [],
                possibilities: this.noPossibilities(),
            })
        } else {
            if (this.state.isSelected) {
                // release piece and make move
                let oldCoordinate = this.state.selectedCoordinate;
                let moveData = {
                    moveFrom: oldCoordinate,
                    moveTo: [x, y]
                }
                this.props.onMovePiece(moveData);
                this.setState({
                    isSelected: false,
                    selectedCoordinate: [],
                    possibilities: this.noPossibilities(),
                });
            } else {
                // selecting a piece for the first time
                let possibilities = this.noPossibilities();
                let possibleMoves = this.state.board[y][x].pieceData[2];
                possibleMoves.forEach(p => {
                    possibilities[p[1]][p[0]] = true;
                });
                this.setState({
                    isSelected: true,
                    selectedCoordinate: [x,y],
                    possibilities: possibilities
                })
            }
        }
    }

    checkSelected(x, y) {
        return this.state.isSelected && this.state.selectedCoordinate[0] === x
            && this.state.selectedCoordinate[1] === y;
    }

    checkPossibility(x, y) {
        return this.state.possibilities[y][x];
    }

    noPossibilities() {
        let possibilities = [];
        for (let i = 0; i < numRows; ++i) {
            possibilities.push([false, false, false, false, false, false, false, false]);
        }
        return possibilities;
    }

    render() {
        return(
            <Grid container={true} style={{height: "88vmin", width: "88vmin"}}>
                {this.state.board.map((x, i) => (
                    <Grid container key={i} style={{width: "100%", height: (100/numRows) + "%"}}>
                        {x.map(x => (
                            <Block
                                key={x.key}
                                coordinate={x.coordinate}
                                colour={x.colour}
                                pieceData={x.pieceData}
                                onCustomClick={this.handleClick}
                                isSelected={this.checkSelected(x.coordinate[0], x.coordinate[1])}
                                isPossible={this.checkPossibility(x.coordinate[0], x.coordinate[1])}
                            />
                        ))}
                    </Grid>
                ))}
                <Modal
                    open={this.props.winner !== 0}
                    style={{
                        top: "44vmin",
                        left: "44vmin",
                        paddingLeft: "15vw",
                        marginLeft: "-250px",
                        marginTop: "-75px"
                    }}
                >
                    <Typography
                        variant="h3"
                        align="center"
                        style={{
                            top: "50%",
                            left: "50%",
                            background:"white",
                            width: "500px",
                            height: "100px",
                            paddingTop: "50px"
                        }}
                    >
                        Player {this.props.winner} Wins
                    </Typography>
                </Modal>
            </Grid>
        )
    }
}


export default ChessBoard