import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import CardContent from '@material-ui/core/CardContent';


var num_rows = 8;
var dark = "#1D2D44";
var light = "#F0EBD8";

function Block(coordinate){
    var color;
    if (coordinate.charCodeAt(0) % 2 === 0){
        if (parseInt(coordinate[1]) % 2 === 0){
            color = dark;
        } else {
            color = light;
        }
    } else {
        if (parseInt(coordinate[1]) % 2 === 0){
            color = light;
        } else {
            color = dark;
        }
    }
    return(
        <Card key={coordinate} style={{width: "100px", height: "100px", backgroundColor: color}}>
            <CardContent/>
        </Card>
    )
}

function Row(key){
    var row = [];
    for (var i = 0; i < num_rows; i++){
        row.push(Block(key + (i + 1)));
    }

    return(
        <Grid key={key} container={true}>
            {row}
        </Grid>
    )
}

function ChessBoard(){
    var chess_board = [];
    var start_code = 'A'.charCodeAt(0);
    for (var i = 0; i < num_rows; i++){
        var row = String.fromCharCode(start_code + i);
        chess_board.push(Row(row));
    }    
    return(
        <Grid container={true}>
            {chess_board}
        </Grid>
    )
}


export default ChessBoard