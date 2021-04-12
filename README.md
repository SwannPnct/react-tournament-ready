# React Tournament Ready

* [Description](#description)
* [Installation](#installation)
* [Usage](#usage)
* [Attributes and examples](#attributes-and-examples)
    * [team and teams](#team-and-teams)
    * [insertScore](#insertScore)
    * [getMatchData](#getMatchData)
    * [onClickMatch](#onClickMatch)
    * [getBracketData](#getBracketData)
    * [loadBracketData](#loadBracketData)

## Description

A React Module to create a tournament bracket with any number of participant from a minimal input.
For the participants to advance, simply insert scores.

![alt text](https://res.cloudinary.com/degvncmzn/image/upload/v1618245456/Screenshot_2021-04-12_at_18.37.11_es3zwz.png)

## Installation

`npm i react-tournament-ready`

## Usage

```
import {Tournament} from 'react-tournament-ready'

const App = () => {
    return (
        <Tournament 
            *attributes*
        />
    )
}
```

## Attributes and examples

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

# To-Do

- [ ] Allow score to be inserted with any other teamID without having to update the current user/team state
- [ ] Fix useEffect missing dependencies warning
- [ ] Customizable style ( props to inline styles )
- [ ] Find a way to simplify data extraction and insertion for an easier compliance with DB models
- [ ] UI : Center automatically tournament view on the user match
- [ ] UI : connect the matches with lines to make a more logical bracket and easier to read
