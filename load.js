import fetch from "node-fetch"

const inFuture = date => (new Date(date ? date : "1/1/9999")).getTime() > (new Date()).getTime()

await fetch(`https://api.themoviedb.org/3/trending/movie/week?language=en-US&api_key=${process.env.TMDB_API_KEY}`).then(r => r.json()).then(async response => {
    response = response.results.filter((entry) => !inFuture(entry.release_date))
    console.log(response.length)

    for (const item of response) {
        try {
            await fetch(`${process.env.ET}/${encodeURIComponent(JSON.stringify({
                type: "Movie",
                title: item.title,
                year: item.release_date.split("-")[0],
                tmdbId: item.id.toString()
            }))}`).then(r => r.text()).then(result => {
                console.log(item.title, result)
            })
        } catch(err) {
            console.error("Error:", err)
        }
        await new Promise(resolve => setTimeout(resolve, 5000))
    }
})
