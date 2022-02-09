const rankEmblemImg = document.getElementById("rank-emblem")
const winsParagraph = document.getElementById("wins")
const lossesParagraph = document.getElementById("losses")
const totalPlayedParagraph = document.getElementById("total-matches")
const listOfMatches = document.getElementById("list-of-matches")
const APIKEY = "RGAPI-c75b5e63-7d94-4084-8802-7a12cacd41e3"
async function getUserId(){
    let region = document.getElementById("region").value
    let summoner = document.getElementById('summoner-name').value
    listOfMatches.innerHTML = ""
    const apiRegion = determineRegion(region)


    const response = await fetch("https://"+ apiRegion[0] +".api.riotgames.com/lol/summoner/v4/summoners/by-name/"+summoner+"?api_key="+APIKEY)

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
    const userKDA = displayMatchUserKDA(matchData, results.puuid)
    console.log("kda", userKDA); 
    displayTotaMatchesPlayed(rankDisplayer[2])

    rankEmblemImg.src = rankEmblemToDisplay
}
    

async function getRank(userId, apiRegion){
    const response = await fetch("https://"+ apiRegion +".api.riotgames.com/lol/league/v4/entries/by-summoner/"+userId+"?api_key="+APIKEY)
    const results = await response.json()
    return results
}

async function getMatchId(puuid, apiRegion){
    const response = await fetch("https://"+ apiRegion +".api.riotgames.com/lol/match/v5/matches/by-puuid/"+puuid+"/ids?start=0&count=10&api_key="+APIKEY)
    const results = await response.json()
    return results
}

async function getMatchData(matchId, apiRegion){
    let response = []
    response = await matchId.map(element => {
        let matchesArray = processMatchData("https://"+ apiRegion +".api.riotgames.com/lol/match/v5/matches/"+element+"?api_key="+APIKEY)
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
    
    matchesArray.forEach(match => {
        let matchinfo = match.info
        console.log("match", match)
        listOfMatches.innerHTML += "<li class=''><p>" + matchinfo.gameMode + " " + matchinfo.participants[0].win + "<p></li>"
    });
    for(i=0; i<matchesArray.length; i++){
        let listOfMatchesId = listOfMatches.childNodes[i].classList
        listOfMatchesId.add("match" + i)
    }
}

function displayMatchUserKDA(matchesArray, userPuuid){
    let kdaArrays = matchesArray.map(match =>{
        let whereKDA = match.info.participants.map(participant =>{
            if(participant.puuid == userPuuid && participant.deaths != 0){
                console.log((parseFloat(participant.assists) + parseFloat(participant.kills))/parseFloat(participant.deaths), participant.kills, participant.deaths, participant.assists);
                return participant.kills
            }
            else if(participant.puuid == userPuuid){
                return "perfect kda"
            }
        })
        for(i=0; i<whereKDA.length; i++){
            if(whereKDA[i] != undefined){
                return whereKDA[i]
            }
        }
    })
    console.log("kdas arrays", kdaArrays);
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



