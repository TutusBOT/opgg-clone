const rankEmblemImg = document.getElementById("rank-emblem")
const winsParagraph = document.getElementById("wins")
const lossesParagraph = document.getElementById("losses")
const totalPlayedParagraph = document.getElementById("total-matches")
const listOfMatches = document.getElementById("list-of-matches")

async function getUserId(){
    let region = document.getElementById("region").value
    let summoner = document.getElementById('summoner-name').value
    const apiRegion = determineRegion(region)


    const response = await fetch("https://"+ apiRegion[0] +".api.riotgames.com/lol/summoner/v4/summoners/by-name/"+summoner+"?api_key=RGAPI-3ec2c0ec-6e36-4d12-a3b7-8924ff0b316f")

    if(response.ok != true){
        console.log("Error");
        return  
    }
    console.log(region);
    const results = await response.json()
    const basicInfo = await getRank(results.id, apiRegion[0])
    const rankDisplayer = await displayRank(basicInfo)
    const matchList = await getMatchId(results.puuid, apiRegion[1])

    const matchData = await getMatchData(matchList, apiRegion[1])
    displayMatchData(matchData)
    console.log("list of matches id", matchList);
    console.log("user id", results);
    console.log("basic info",basicInfo);
    console.log("matches in array", matchData);
    console.log("rank", rankDisplayer);
    document.getElementById('rank').innerText = rankDisplayer[0];

    const rankEmblemToDisplay = await displayRankEmblem(rankDisplayer[1]) 
    displayTotaMatchesPlayed(rankDisplayer[2])

    rankEmblemImg.src = rankEmblemToDisplay
}
    

async function getRank(userId, apiRegion){
    const response = await fetch("https://"+ apiRegion +".api.riotgames.com/lol/league/v4/entries/by-summoner/"+userId+"?api_key=RGAPI-3ec2c0ec-6e36-4d12-a3b7-8924ff0b316f")
    const results = await response.json()
    return results
}

async function getMatchId(puuid, apiRegion){
    const response = await fetch("https://"+ apiRegion +".api.riotgames.com/lol/match/v5/matches/by-puuid/"+puuid+"/ids?start=0&count=10&api_key=RGAPI-3ec2c0ec-6e36-4d12-a3b7-8924ff0b316f")
    const results = await response.json()
    return results
}

async function getMatchData(matchId, apiRegion){
    let response = []
    response = await matchId.map(element => {
        let matchesArray = processMatchData("https://"+ apiRegion +".api.riotgames.com/lol/match/v5/matches/"+element+"?api_key=RGAPI-3ec2c0ec-6e36-4d12-a3b7-8924ff0b316f")
        return matchesArray
    });
    const result = await Promise.all(response)
    return result
}

async function processMatchData(fetchLink){
    const response = await fetch(fetchLink)
    const results = await response.json()
    return results
}

function displayMatchData(matchesArray){
    listOfMatches.innerHTML = ""
    matchesArray.forEach(match => {
        let matchinfo = match.info
        console.log("match", match)
        listOfMatches.innerHTML += "<li>" + matchinfo.gameMode + " " + matchinfo.participants[0].win + "</li>"
    });
}

async function displayRank(rankData){
    let rankToDisplay = []
    const rank = await rankData
    for(i=0; i<rank.length; i++){
        if(rank[i].queueType == "RANKED_SOLO_5x5"){
            rankToDisplay[0] = rank[i].tier + " " + rank[i].rank + " " + rank[i].leaguePoints + "LP"
            rankToDisplay[1] = rank[i].tier
            rankToDisplay[2] = rank[i].wins+";"+rank[i].losses
            return rankToDisplay
        }
    }
    return "no solo/duo rank"
}

async function displayRankEmblem(rank){
    const rankEmblem = await rank
    let rankEmblemSrc = "/images/ranked-emblems/" + rankEmblem + ".png"
    return rankEmblemSrc
}

function determineRegion(region){
    let api = []
    if(region == "EUNE"){
        api[0] = "eun1"
        api[1] = "europe"
    }
    else if(region == "EUW"){
        api[0] = "euw1"
        api[1] = "europe"
    }
    else if(region == "NA"){
        api[0] = "na1"
        api[1] = "americas"
    }
    else if(region == "RU"){
        api[0] = "ru"
        api[1] = "europe"
    }
    return api
}

function displayTotaMatchesPlayed(matches){
    let data = matches.split(";")
    let total = parseInt(data[0]) + parseInt(data[1])
    winsParagraph.innerText = "Wins: " + data[0]
    lossesParagraph.innerText = "Losses: " + data[1]
    totalPlayedParagraph.innerText = "Total: " + total
}



