# React Tournament Ready

* [Description](#description)
* [Installation](#installation)
* [Usage](#usage)
* [Usage props and examples](#usage-props-and-examples)
    * [team and teams](#team-and-teams)
    * [insertScore](#insertScore)
    * [getMatchData](#getMatchData)
    * [onClickMatch](#onClickMatch)
    * [getBracketData](#getBracketData)
    * [loadBracketData](#loadBracketData)
* [Helpers](#helpers)
    * [createBracket](#createBracket)
    * [insertScore (h)](#insertScore-(h))
* [Style props](#style-props)
* [To-Do](#to-do)
* [Releases](#releases)

## Description

- GitHub : https://github.com/SwannPnct/react-tournament-ready
- npm : https://www.npmjs.com/package/react-tournament-ready

A React Module to create a tournament bracket with any number of participant from a minimal input.
For the participants to advance, simply insert scores.

![alt text](https://res.cloudinary.com/degvncmzn/image/upload/v1618245456/Screenshot_2021-04-12_at_18.37.11_es3zwz.png)

## Installation

`npm i react-tournament-ready`

## Usage

```
import Tournament from 'react-tournament-ready'

const App = () => {
    return (
        <Tournament 
            *attributes*
        />
    )
}
```

## Usage props and examples

### team and teams
***required for the bracket generation***

The attribute `team` input the current user info. The view and the scores will be set depending of it.
The attribute `teams` input all the participants/teams/players, including the current user.

```
<Tournament 
    team = {
        {
            name: "team1,
            id : "team1ID"
        }   
    },
    teams = {
        [
            {
                name: "team1,
                id : "team1ID"
            },
            {
                name: "team2,
                id : "team2ID"
            },
        ]
    }
    />
```
### insertScore
***required for bracket to advance***

Use this attribute to insert the score of the current user, on its current match.

```
const [score, setScore] = useState(null)

const handleSetNewScore = () => {

    setScore({
        score : 26
    })

    //score is an object with 1 key ('score')
}

<Tournament 
    team= {...}
    teams = {[{...}]}
    insertScore={score}
    />
```

### getMatchData
***optional***

Use this attribute to extract a deep copy of the current user match (the one you've set on the `team` attribute)

```
const handleCurrentMatchData = (data) => {
    // handle data
}

<Tournament 
    team= {...}
    teams = {[{...}]}
    getMatchData={(data) => handleCurrentMatchData(data)}
    />
```

A Match is a class instance that looks like :

```
{
    id : "team1IDteam2ID", // concatenation of the two teams ID
    crd : [roundNumber, matchNumber] // way of localizing the match in the bracket 2d array,
    teams: [
        {name: "team1", id: "team1ID"},{name: "team2", id: "team2ID"}
    ],
    score: [scoreTeam1, scoreTeam2],
    isDone : boolean // default : false
}
```

### onClickMatch
***optional***

Use this attribute to extract a deep copy of the clicked match.

```
const handleClickedMatchData = (data) => {
    // handle data
}

<Tournament 
    team= {...}
    teams = {[{...}]}
    onClickMatch={(data) => handleClickedMatchData(data)}
    />
```

### getBracketData
***optional***

Use this attribute to extract a deep copy of the bracket data every time there is a change to it.

```
const handleBracketData = (data) => {
    // save the data in DB or send it via sockets for real time experience
}

<Tournament 
    team= {...}
    teams = {[{...}]}
    getBracketData={(data) => handleBracketData(data)}
    />
```

The bracket data is two-dimensional array. Each sub-array represents a round, and each of the rounds includes the related Match instances that you saw earlier.
Here how it might look like : 

```
[
    [
        {Match},{Match},{Match},{Match} // quarter finals
    ],
    [
        {Match},{Match} // semi finals
    ],
    [
        {Match} // finals
    ]
]
```

### loadBracketData
***optional***

Use this attribute to load bracket data into the module. Use it while component is mounting if you want one-time update, or with web sockets for real-time.

```

const [dataToLoad, setDataToLoad] = useState(null)

useEffect(() => {

    //your data fetching

    setDataToLoad(fetchedData)

    //once the state is updated and is different from null or undefined, the data loading is triggered into the

},[])

<Tournament 
    team= {...}
    teams = {[{...}]}
    loadBracketData={dataToLoad}
    />
```

## Helpers

### createBracket
`(teams)`

```
import {createBracket} from 'react-tournament-ready'

//same format as team/teams
const teams = [
    {
        ...
    }
]

//return a full bracket, same format as getBracketData returned value
const newBracket = createBracket(teams)

```

### insertScore (h)
`(user,score,bracket)`

```
import {createBracket,insertScore} from 'react-tournament-ready'

const teams = [
    {
        ...
    }
]

const newBracket = createBracket(teams)

const modifiedBracket = insertScore(teams[0],{score: 12},newBracket)

```

## Style props

### gamesStyle

Default:
```
{
    width: "150px",
    backgroundColor: "#EEEEEE",
    marginTop: "10px",
    marginBottom: "10px",
    border: "1px solid black",
    borderRadius: "10px",
    padding: "5px"
}
```

### teamGamesStyle

Default:
```
{
    width: "150px",
    backgroundColor: "#B4FFB7",
    marginTop: "10px",
    marginBottom: "10px",
    border: "1px solid black",
    borderRadius: "10px",
    padding: "5px"
}
```

### gamesDivStyleTop

Default:
```
{
    textAlign: "center",
    padding: "5px",
    height: "20px",
    borderBottom: "1px solid black",
    display : "grid",
    gridTemplateColumns: "3fr 1fr"
}
```

### gamesDivStyleBottom

Default:
```
{
    textAlign: "center",
    padding: "5px",
    height: "20px",
    display : "grid",
    gridTemplateColumns: "3fr 1fr"
}
```

### gamesDivStyleLeft

Default:
```
{
    borderRight: "1px solid black"
}
```

### gamesDivStyleRight

Default:
```
{
    //empty
}
```

### winningScoreStyle

Default:
```
{
    fontWeight: "700"
}
```


# To-Do

- [ ] Allow score to be inserted with any other teamID without having to update the current user/team state
- [ ] UI : Fix useEffect missing dependencies warning
- [x] Customizable style ( props to inline styles )
- [ ] Find a way to simplify data extraction and insertion for an easier compliance with DB models
- [ ] UI : Center automatically tournament view on the user match
- [ ] UI : Connect the matches with lines to make a more logical bracket and easier to read
- [x] Make the component usable from ‘react-tournament-ready’ and not from the dist folder
- [ ] Make the component props automatically showing as hints to help with usage
- [x] Make generate bracket function usable without using the component ( help for backend)
- [x] Bracket handling for 1 or 2 teams ( does not work at all for now)

# Releases

### 1.1.1
* added index.js as main file to export all modules
* added exports field in package json to configure absolute imports
* change publish scripts to it does include whole src directory
* updated documentation

### 1.0.9 to 1.1.0
* externalized insert score function, as a helper
* externalized find match by team id, as a helper

### 1.0.8
* style is now customizable, limited to the games only
* fix props.onClickMatch is not a function

### 1.0.5 to 1.0.7
* bracket handling for 1 or 2 teams
* removed unused dependencies

### 1.0.4
* externalized bracket generation function so it be usable as a helper for an usage outside of the component

### 1.0.0 to 1.0.3
* npm publishing
* readme change
* publishing bug fixes


