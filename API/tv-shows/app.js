const form = document.querySelector('#searchForm')
const imgContainer = document.querySelector('#imgContainer')

form.addEventListener('submit', async function (e){
    e.preventDefault()
    const searchTerm = form.elements.query.value
    const config = { params: { q: searchTerm }}
    const res = await axios.get(`https://api.tvmaze.com/search/shows`, config)
    makeImages(res.data)
    form.elements.query.value = ""
})

const makeImages = (shows) => {

    clearImages()

    for(let result of shows){

        if(result.show.image){
            const img = document.createElement('img')        
            img.src = result.show.image.medium
    
            // Append to a link and then container
            const link = document.createElement('a')
            link.href = result.show.url
            link.append(img)
            imgContainer.append(link)
        }

    }
}

const clearImages = () => imgContainer.innerHTML = ""
