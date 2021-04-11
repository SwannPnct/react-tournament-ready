import './App.css'

//subcomponent
//the onclick event is for testing only
const Game = (props) => {

    //check if team is one of the two of this game
    const team = props.teams.find(t => t.id === props.teamID)

    //inline styles
    
    const gamesStyle = {
        width: "150px",
        backgroundColor: team ? "#B4FFB7" :"#EEEEEE",
        marginTop: "10px",
        marginBottom: "10px",
        border: "1px solid black",
        borderRadius: "10px",
        padding: "5px"
    }

    const emptyGamesStyle = {
        width: "100px",
        marginTop: "10px",
        marginBottom: "10px",
        opacity: "0%"
    }

    const gamesDivStyleTop = {
        textAlign: "center",
        padding: "5px",
        height: "20px",
        borderBottom: "1px solid black",

        display : "grid",
        gridTemplateColumns: "3fr 1fr"
    }

    const gamesDivStyleBottom = {
        textAlign: "center",
        padding: "5px",
        height: "20px",

        display : "grid",
        gridTemplateColumns: "3fr 1fr"
    }

    const leftDivStyle = {
        borderRight: "1px solid black"
    }

    const winningScoreStyle = {
        fontWeight: "700"
    }

    const finaleTextStyle = {
        position : "absolute",
        top : (parseInt(props.bracketHeight) /2) - parseInt(gamesDivStyleTop.height) * 4 + "px",
        left: parseInt(props.bracketWidth) - parseInt(gamesStyle.width) -  parseInt(gamesStyle.padding) * 2+ "px"
    }

    return (
        <div>
            {props.crd[0] ===  props.bracketLength -1 ? (<h3 style={finaleTextStyle}>Final</h3>) : null}
            <div onClick={() => props.handleClickOnMatchFromParent(props.crd)} style={props.crd[0] === 0 && !props.teams[0].id ? emptyGamesStyle : gamesStyle}>
                <div style={gamesDivStyleTop}>
                    <div style={leftDivStyle}>{props.teams[0].name}</div>
                    <div style={props.score[0] > props.score[1] ? winningScoreStyle : {}}>{props.score[0]}</div>
                </div>
                <div style={gamesDivStyleBottom}>
                    <div style={leftDivStyle}>{props.teams[1].name}</div>
                    <div style={props.score[1] > props.score[0] ? winningScoreStyle : {}}>{props.score[1]}</div>
                </div>
            </div>
        </div>
    )
}

export default Game