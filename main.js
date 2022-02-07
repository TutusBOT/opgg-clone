const rankEmblemImg = document.getElementById("rank-emblem")


async function getUserId(){
    let summoner = document.getElementById('summoner-name').value
    const response = await fetch("https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+summoner+"?api_key=RGAPI-29a95ea5-86a5-426d-8b6b-327429bd9b59")
    const results = await response.json()
    
    const basicInfo = await getRank(results.id)
    const rankDisplayer = await displayRank(basicInfo)
    const matchList = await getMatchId(results.puuid)

    const matchData = await getMatchData(matchList[0])
    console.log("list of matches id", matchList);
    console.log("user id", results);
    console.log("basic info",basicInfo);
    console.log("match data", matchData);
    console.log("rank", rankDisplayer);
    document.getElementById('wynik').innerHTML = rankDisplayer[0];
    const rankEmblemToDisplay = await displayRankEmblem(rankDisplayer[1])
    rankEmblemImg.src = rankEmblemToDisplay
    console.log("img src", rankEmblemToDisplay);
}

async function getRank(userId){
    const response = await fetch("https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/"+userId+"?api_key=RGAPI-29a95ea5-86a5-426d-8b6b-327429bd9b59")
    const results = await response.json()
    return results
}

async function getMatchId(puuid){
    const response = await fetch("https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/"+puuid+"/ids?start=0&count=20&api_key=RGAPI-29a95ea5-86a5-426d-8b6b-327429bd9b59")
    const results = await response.json()
    return results
}

async function getMatchData(matchId){
    const response = await fetch("https://europe.api.riotgames.com/lol/match/v5/matches/"+matchId+"?api_key=RGAPI-29a95ea5-86a5-426d-8b6b-327429bd9b59")
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