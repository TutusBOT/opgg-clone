getData()


async function getData(){
    const response = await fetch("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/TutusBOT?api_key=RGAPI-2c255ea8-75fa-44d3-90e0-175da48fe731")
    const results = await response.json()
    console.log(results);
}