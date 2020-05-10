import React from 'react';
import ChessBoard from './ChessBoard';
import SideBar from './SideBar';




class TwoPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerNumber: this.props.playerNumber,
            playerID: this.props.playerID,
            gameID: this.props.gameID
        }
    }

    render() {
        return (
            <div className="TwoPlayer" style={{width: "100%", position: "relative", overflow: "hidden", height: "100vh", backgroundColor: "#748CAB"}}>
                <SideBar/>
                <div style={{marginLeft: "12vw"}}>
                    <ChessBoard
                        isSinglePlayer={false}
                        playerNumber={this.state.playerNumber}
                        gameID={this.props.gameID}
                        playerID={this.props.playerID}
                    />
                </div>
            </div>
        );
    }
  
}



  export default TwoPlayer