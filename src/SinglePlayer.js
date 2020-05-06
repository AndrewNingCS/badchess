import React from 'react';
import ChessBoard from './ChessBoard';
import SideBar from './SideBar';




function SinglePlayer() {
  return (
    <div className="SinglePlayer" style={{width: "100%", position: "relative", overflow: "hidden", height: "100vh", backgroundColor: "#748CAB"}}>
      <SideBar/>
      <div style={{marginLeft: "12vw"}}>
        <ChessBoard/>
      </div>
    </div>
  );
}



  export default SinglePlayer