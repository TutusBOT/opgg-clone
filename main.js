const rankEmblemImg = document.getElementById("rank-emblem")
const winsParagraph = document.getElementById("wins")
const lossesParagraph = document.getElementById("losses")
const totalPlayedParagraph = document.getElementById("total-matches")

async function getUserId(){
    let region = document.getElementById("region").value
    let summoner = document.getElementById('summoner-name').value
    const apiRegion = determineRegion(region)


    const response = await fetch("https://"+ apiRegion[0] +".api.riotgames.com/lol/summoner/v4/summoners/by-name/"+summoner+"?api_key=RGAPI-29a95ea5-86a5-426d-8b6b-327429bd9b59")

    if(response.ok != true){
        console.log("Error");
        return  
    }
    console.log(region);
    const results = await response.json()
    const basicInfo = await getRank(results.id, apiRegion[0])
    const rankDisplayer = await displayRank(basicInfo)
    const matchList = await getMatchId(results.puuid, apiRegion[1])

    const matchData = await getMatchData(matchList[0], apiRegion[1])
    console.log("list of matches id", matchList);
    console.log("user id", results);
    console.log("basic info",basicInfo);
    console.log("match data", matchData);
    console.log("rank", rankDisplayer);
    document.getElementById('rank').innerText = rankDisplayer[0];

    const rankEmblemToDisplay = await displayRankEmblem(rankDisplayer[1]) 
    displayTotaMatchesPlayed(rankDisplayer[2])

    rankEmblemImg.src = rankEmblemToDisplay
}
    

async function getRank(userId, apiRegion){
    const response = await fetch("https://"+ apiRegion +".api.riotgames.com/lol/league/v4/entries/by-summoner/"+userId+"?api_key=RGAPI-29a95ea5-86a5-426d-8b6b-327429bd9b59")
    const results = await response.json()
    return results
}

async function getMatchId(puuid, apiRegion){
    const response = await fetch("https://"+ apiRegion +".api.riotgames.com/lol/match/v5/matches/by-puuid/"+puuid+"/ids?start=0&count=20&api_key=RGAPI-29a95ea5-86a5-426d-8b6b-327429bd9b59")
    const results = await response.json()
    return results
}

async function getMatchData(matchId, apiRegion){
    const response = await fetch("https://"+ apiRegion +".api.riotgames.com/lol/match/v5/matches/"+matchId+"?api_key=RGAPI-29a95ea5-86a5-426d-8b6b-327429bd9b59")
    const results = await response.json()
    return results
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
    winsParagraph.innerText = data[0]
    lossesParagraph.innerText = data[1]
    totalPlayedParagraph.innerText = parseInt(data[0]) + parseInt(data[1])
}