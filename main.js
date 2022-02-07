


async function getUserId(){
    let summoner = document.getElementById('summonerName').value
    const response = await fetch("https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+summoner+"?api_key=RGAPI-29a95ea5-86a5-426d-8b6b-327429bd9b59")
    const results = await response.json()
    
    const basicInfo = await getData(results.id)
    
    const matchList = await getMatchId(results.puuid)
    console.log(matchList.json());
    console.log(results);
    document.getElementById('wynik').innerHTML = results.summonerLevel;
}

async function getData(userId){
    console.log(userId);
    const response = await fetch("https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/"+userId+"?api_key=RGAPI-29a95ea5-86a5-426d-8b6b-327429bd9b59")
    const results = await response.json()
    console.log(results);
}

async function getMatchId(puuid){
    const response = await fetch("https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/"+puuid+"/ids?start=0&count=20&api_key=RGAPI-29a95ea5-86a5-426d-8b6b-327429bd9b59")
    return response
}