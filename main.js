var summoner = document.getElementById('summonerName').value


async function getUserId(){
    const response = await fetch("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+summoner+"?api_key=RGAPI-2b678016-90bb-4aa0-9f6b-6b90d55ef73b")
    const results = await response.json()
    const basicInfo = await getData(results.id)
    console.log(results);
    document.getElementById('wynik').innerHTML = results.summonerLevel;
}

async function getData(userId){
    console.log(userId);
    const response = await fetch("https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/"+userId+"?api_key=RGAPI-2b678016-90bb-4aa0-9f6b-6b90d55ef73b")
    const results = await response.json()
    console.log(results);
}