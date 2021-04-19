import React from 'react'; //subcomponent
//the onclick event is for testing only

const Game = props => {
  //check if team is one of the two of this game
  const team = props.teams.find(t => t.id === props.teamID); //inline styles

  const gamesStyle = props.gamesStyle ? props.gamesStyle : {
    width: "150px",
    backgroundColor: "#EEEEEE",
    marginTop: "10px",
    marginBottom: "10px",
    border: "1px solid black",
    borderRadius: "10px",
    padding: "5px"
  };
  const teamGamesStyle = props.teamGamesStyle ? props.teamGamesStyle : {
    width: "150px",
    backgroundColor: "#B4FFB7",
    marginTop: "10px",
    marginBottom: "10px",
    border: "1px solid black",
    borderRadius: "10px",
    padding: "5px"
  };
  const emptyGamesStyle = {
    width: parseInt(gamesStyle.width) + "px",
    marginTop: parseInt(gamesStyle.marginTop) + "px",
    marginBottom: parseInt(gamesStyle.marginBottom) + "px",
    opacity: "0%"
  };
  const gamesDivStyleTop = props.gamesDivStyleTop ? props.gamesDivStyleTop : {
    textAlign: "center",
    padding: "5px",
    height: "20px",
    borderBottom: "1px solid black",
    display: "grid",
    gridTemplateColumns: "3fr 1fr"
  };
  const gamesDivStyleBottom = props.gamesDivStyleBottom ? props.gamesDivStyleBottom : {
    textAlign: "center",
    padding: "5px",
    height: "20px",
    display: "grid",
    gridTemplateColumns: "3fr 1fr"
  };
  const gamesDivStyleLeft = props.gamesDivStyleLeft ? props.gamesDivStyleLeft : {
    borderRight: "1px solid black"
  };
  const gamesDivStyleRight = props.gamesDivStyleRight ? props.gamesDivStyleRight : {};
  const winningScoreStyle = props.winningScoreStyle ? props.winningScoreStyle : {
    fontWeight: "700"
  };
  const finaleTextStyle = {
    position: "absolute",
    top: parseInt(props.bracketHeight) / 2 - parseInt(gamesDivStyleTop.height) * 4 + "px",
    left: parseInt(props.bracketWidth) - parseInt(gamesStyle.width) - parseInt(gamesStyle.padding) * 2 + "px"
  };
  return /*#__PURE__*/React.createElement("div", null, props.crd[0] === props.bracketLength - 1 ? /*#__PURE__*/React.createElement("h3", {
    style: finaleTextStyle
  }, "Final") : null, /*#__PURE__*/React.createElement("div", {
    onClick: () => props.handleClickOnMatchFromParent(props.crd),
    style: props.crd[0] === 0 && !props.teams[0].id ? emptyGamesStyle : team ? teamGamesStyle : gamesStyle
  }, /*#__PURE__*/React.createElement("div", {
    style: gamesDivStyleTop
  }, /*#__PURE__*/React.createElement("div", {
    style: gamesDivStyleLeft
  }, props.teams[0].name), /*#__PURE__*/React.createElement("div", {
    style: { ...gamesDivStyleRight,
      ...(props.score[0] > props.score[1] ? winningScoreStyle : {})
    }
  }, props.score[0])), /*#__PURE__*/React.createElement("div", {
    style: gamesDivStyleBottom
  }, /*#__PURE__*/React.createElement("div", {
    style: gamesDivStyleLeft
  }, props.teams[1].name), /*#__PURE__*/React.createElement("div", {
    style: { ...gamesDivStyleRight,
      ...(props.score[1] > props.score[0] ? winningScoreStyle : {})
    }
  }, props.score[1]))));
};

export default Game;