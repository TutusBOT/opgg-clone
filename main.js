const rankEmblemImg = document.getElementById("rank-emblem")
const winsParagraph = document.getElementById("wins")
const lossesParagraph = document.getElementById("losses")
const totalPlayedParagraph = document.getElementById("total-matches")
const listOfMatches = document.getElementById("list-of-matches")

const APIKEY = "RGAPI-34c8c358-0581-4a15-9f69-bf3f8501e0ae"



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
    const matchesHistory = await displayMatchData(matchData)
    const icon = await basicSummonerInfo(results)
    const summonerGames = await summonerGame(results,matchData)


    console.log("list of matches id", matchList);
    console.log("user id", results);
    console.log("basic info",basicInfo);
    console.log("matches in array", matchData);
    console.log("rank", rankDisplayer);
    document.getElementById('rank').innerText = rankDisplayer[0];

    const rankEmblemToDisplay = await displayRankEmblem(rankDisplayer[1]) 
    // const userKDA = displayMatchUserKDA(matchData, results.puuid)
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

async function displayMatchData(matchesArray){
    const queueFetch = await fetch("scripts/queues.json")
    // const summoner = document.getElementById('summoner-name').value  po co to pobierać?
    const queueObject = await queueFetch.json()
    console.log(queueObject);
    let matchinfo = matchesArray.map(match => {
        let matchinfo = match.info
        console.log("match", match)
        listOfMatches.innerHTML += "<li class=''><p class='game-mode'></p></li>";
        return matchinfo
    });
    for(i=0; i<matchesArray.length; i++){
        let listOfMatchesId = listOfMatches.childNodes[i].classList
        listOfMatchesId.add("match" + i)
        listOfMatchesId.add("match")
        listOfMatches.childNodes[i].innerHTML += "<div class='teamOne' id=Team" + i + "a>"
        for(l=0; l<5; l++){
            let summonerName = matchinfo[i].participants[l].summonerName
            let query = document.querySelector("#Team"+i+"a")
            let champion = matchinfo[i].participants[l].championName;
            let summonerNameFormatted = summonerName
            if(summonerName.length > 10){
                summonerNameFormatted = summonerName.slice(0, 7)+"..."
            }
            query.innerHTML += "<span><div class='match-summonername'>" + summonerNameFormatted + "<div class='match-summonername-info'>"+ summonerName +"</div>" + "</div><img src=images/champion/"+champion+ ".png>" +"</span>";
            
        }
 
        listOfMatches.childNodes[i].innerHTML += "</div>"
        listOfMatches.childNodes[i].innerHTML += "<div class='teamTwo' id=Team" + i + "b>"
        for(l=5; l<10; l++){
            let summonerName = matchinfo[i].participants[l].summonerName
            let query = document.querySelector("#Team"+i+"b")
            let champion = matchinfo[i].participants[l].championName;
            let summonerNameFormatted = summonerName
            if(summonerName.length > 10){
                summonerNameFormatted = summonerName.slice(0, 7)+"..."
            }
            query.innerHTML += "<span><div class='match-summonername'>" + summonerNameFormatted + "<div class='match-summonername-info'>"+ summonerName +"</div>" + "</div><img src=images/champion/"+champion+ ".png>" +"</span>";

        }

        queueObject.forEach(id =>{
           if(id.queueId == matchinfo[i].queueId){
               listOfMatches.childNodes[i].childNodes[0].innerText = id.description
           } 
        })

    }
    console.log("list of matches", listOfMatches);
    console.log(matchesArray[0].info.participants[3].summonerName.length);
}

// function displayMatchUserKDA(matchesArray, userPuuid){
//     let kdaArrays = matchesArray.map(match =>{
//         let whereKDA = match.info.participants.map(participant =>{
//             if(participant.puuid == userPuuid && participant.deaths != 0){
//                 console.log((parseFloat(participant.assists) + parseFloat(participant.kills))/parseFloat(participant.deaths), participant.kills, participant.deaths, participant.assists);
//                 return participant.kills
//             }
//             else if(participant.puuid == userPuuid){
//                 return "perfect kda"
//             }
//         })
//         for(i=0; i<whereKDA.length; i++){
//             if(whereKDA[i] != undefined){
//                 return whereKDA[i]
//             }
//         }
//     })
//     console.log("kdas arrays", kdaArrays);
// }  dodane do summonerGame()

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
    rankToDisplay[0] = "no solo/duo rank"
    // rankToDisplay[1] = ""
    // rankToDisplay[2] = ""
    return rankToDisplay
}

async function displayRankEmblem(rank){
    const rankEmblem = await rank
    let rankEmblemSrc = "images/ranked-emblems/" + rankEmblem + ".png"
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

async function basicSummonerInfo(result){
    let path = "images/profileicon/" + result.profileIconId + ".png";
    document.getElementById("basic-info-icon").src = path;
    document.getElementById("basic-info-name").innerHTML = result.name;
    document.getElementById("basic-info-lvl").innerHTML = result.summonerLevel;
}

async function summonerGame(result,matchData){
    let path, query, champion, kills, deaths, assists, kda, cs, duration, durationMinutes
    for(i = 0; i < matchData.length; i++){
        path = ".match" + i;
        query = document.querySelector(path)

        for(l = 0; l < matchData.length; l++){
            if(matchData[i].info.participants[l].summonerName == result.name){
                let short = matchData[i].info.participants[l]
                champion = short.championName
                kills = short.kills
                deaths = short.deaths
                assists = short.assists
                cs = short.totalMinionsKilled
                duration = matchData[i].info.gameDuration
                if (!duration % 60) durationMinutes = ':00'
                else if (duration % 60 < 10) durationMinutes = ":0" + duration % 60
                else { durationMinutes = ":" + duration % 60}
                duration = Math.floor(duration / 60)
                if(deaths){
                    kda = (parseFloat(kills) + parseFloat(assists))/parseFloat(deaths)
                    kda = kda.toFixed(2)
                }
                else{
                    kda = "Perfect"
                }
                if(matchData[i].info.participants[l].win == true){
                    query.classList.add("win")
                }
                else if(matchData[i].info.participants[l].win == false){
                    query.classList.add("lose")
                }

            }
        }
        query.innerHTML += "<div class='player-info'><span>" + result.name + " " + "</span><img src=images/champion/"+ champion + ".png></div><div class='player-stats'><span>" + kills + "/" + deaths + "/" + assists + "</span><span>"+ kda +" KDA</span><span>" + cs + " CS</span></div><div class='match-info'><span>" + duration + durationMinutes + "</span></div>";
    }  
}
