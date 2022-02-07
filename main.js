getData()


async function getData(){
    const response = await fetch("https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/TutusBOT?api_key=RGAPI-29a95ea5-86a5-426d-8b6b-327429bd9b59")
    const results = await response.json()
    console.log(results);
}