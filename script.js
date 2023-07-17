
// Access key for Marvel website
const publicKey = '243e2f91e31f5671decfe3e7a4c2c124';
const privateKey = '9c3ca234de5578551c51dd8c123cafad074baf63';

var searchCharacterList = [];

// api hash
function generateHash(timestamp) {
  const md5Hash = CryptoJS.MD5(timestamp + privateKey + publicKey);
  return md5Hash.toString();
}


// Dynamic search function
function fetchdynamic(keyword) {
    const timestamp = Date.now().toString();
    const hash = generateHash(timestamp);
    // console.log(hash);
  const apiUrl = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${keyword}&ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const characters = data.data.results;
      characters.forEach(element => searchCharacterList.push(element.id))
      initializeRows(characters)
    })
    .catch(error => {
      console.error('Error:', error);
    });

}


// To load initialize all data
function initialFetch() {
    const timestamp = Date.now().toString();
    const hash = generateHash(timestamp);
  const apiUrl = `https://gateway.marvel.com/v1/public/characters?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const characters = data.data.results;
      initializeRows(characters)
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


// To get specific character
function getCharacter(event_id) {
    event_id =event_id.toString().split("v")
    if (event_id.length >1){
        event_id = event_id[1]
    }
    const timestamp = Date.now().toString();
    const hash = generateHash(timestamp);
  const apiUrl = `https://gateway.marvel.com/v1/public/characters/${event_id}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const characters = data.data.results;
    //   console.log(characters,"eeeeeeeeeeeeeeee")
      viewCharacter(characters[0])
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


// To all favorite characters
async function fetchAllFavoriteCharacters(){
    var value = window.localStorage.getItem("favoriteCharacter")
    if (!value){
        return
    }
    value =JSON.parse(value)
    const timestamp = Date.now().toString();
    const hash = generateHash(timestamp);
   
    let alldata = []
    for (element of value){
        if (element){
            const apiUrl = `https://gateway.marvel.com/v1/public/characters/${element}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                alldata.push(data.data.results[0]);

            }catch(error){
                console.error("Error",error)
            }
        }

    }

    console.log(alldata)
    return alldata
}






// To show favorite characters
async function  showFavorite() {
    heros=await fetchAllFavoriteCharacters()
    console.log(heros,"ddddddddddd")
    document.getElementById("hero_row").style.display = "none";
    document.getElementById("banner_row").style.display = "none";
    document.getElementById("character_desc").style.display = "none";
    var hero_row_div = document.getElementById("character_favorite");
    hero_row_div.style.display = "flex";

    while (hero_row_div.firstChild) {
        hero_row_div.removeChild(hero_row_div.lastChild);
    };

    for (hero of heros) {
        const div = document.createElement('div');
        div.className = 'col';
        div.id = "child_hero_rows";
        let image = `${hero.thumbnail.path}.${hero.thumbnail.extension}`
        div.innerHTML =
                `<div class="card" style="width: 21rem;">
        <img class="card-img-top" src=${image} alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${hero.name}</h5>
    
            <a onclick={getCharacter(this.id)} id=v${hero.id} class="btn btn-primary" value=${hero.id} >View desc</a>
            <a onclick={likeCharacter(this.id)} id=sl${hero.id} class="btn btn-secondary"
             style = "background-color : ${getBgColourUsingId(hero.id)};" value=${hero.id} > Like</a>
        </div>`
                ;

            hero_row_div.appendChild(div);
        }
    


}




// To set local staorage value
function set_localstorage(event_id, values) {
    return window.localStorage.setItem(event_id, values);

}


// To get local staorage value
function get_localstorage(event_id) {

    return window.localStorage.getItem(event_id);

}





const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Function to fetch data from the API based on the user input
async function fetchData(searchTerm) {
    const timestamp = Date.now().toString();
    const hash = generateHash(timestamp);
    const apiUrl = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchTerm}&ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

  const response = await fetch(apiUrl)
  const data = await response.json();
  return data.data.results; // Adjust the path to the results in your API response
}

// Function to display the search results
function displayResults(results) {
  searchResults.innerHTML = "";
  results.forEach(result => {
    const listItem = document.createElement("div");
    listItem.innerHTML=`<div class="d-flex">
    <div onclick={getCharacter(${result.id})}>${result.name}</div> 
    &nbsp; &nbsp; 
    <a onclick={likeCharacter(this.id)} id=fl${result.id} 
    style = "background-color : ${getBgColourUsingId(result.id)};width:50px;height:40px" 
    class="btn btn-secondary">like</a>
    </div><hr>`
    searchResults.appendChild(listItem);
  });
}

// To capture user input in search bar
async function dynamicSearchClick() {
    var keyword = document.getElementById("dynamic_search_input").value;
    var search_element = document.getElementById("dynamic_search");
    const filteredData = await fetchData(keyword);
    console.log(filteredData,"filtered data")
    displayResults(filteredData);
    
}



// To like character
function likeCharacter(event_id) {
    console.log(find,"firsttttttt fidssssssssss")
    var local_value = get_localstorage("favoriteCharacter");
    event_id = event_id.split("l")[1]
    bg_color = "pink"
    if (!local_value) {
        let newarr = JSON.stringify([event_id])
        set_localstorage("favoriteCharacter", newarr);

    } else {

        existing = JSON.parse(local_value)
        
        if (existing.includes(event_id)) {
            bg_color = "white"
            let remove=[]
            existing.forEach(element => {
                if (element != event_id){
                        remove.push(element)
                }
            })
            
            set_localstorage("favoriteCharacter",JSON.stringify(remove));
        } else {

            let add= [...existing,event_id]
            set_localstorage("favoriteCharacter", JSON.stringify(add));
        }

    }

    initial = document.getElementById(`il${event_id}`)
    if (initial){
        initial.style.backgroundColor = bg_color;
    }
    viewDesc = document.getElementById(`vl${event_id}`)
    if (viewDesc){
        viewDesc.style.backgroundColor = bg_color;
    }
    show = document.getElementById(`sl${event_id}`)
    if (show){
        show.style.backgroundColor = bg_color;
    }

    find = document.getElementById(`fl${event_id}`)
    console.log(find,"fidssssssssss")
    if (find){
        console.log(find,"iffffffff fidssssssssss")
        find.style.backgroundColor = bg_color;
    }

}


// To add bg color for like button
function getBgColourUsingId(character_id) {
    var local_value = get_localstorage('favoriteCharacter');
    var color="";
    if (!local_value) {
        color = "white";

    } else if (local_value.includes(character_id)) {
        color =  "pink" 

    } else{
        color = "White"
    }

    // console.log("final color",color)
    return color

}


// To view product from search results
function searchviewCharacter(event_id) {
    event_id = event_id.split("s")[1]
    event_id = `v${event_id}`
    return getCharacter(event_id)
}

// To view particular meal
function viewCharacter(character) {
    document.getElementById("hero_row").style.display = "none";
    document.getElementById("banner_row").style.display = "none";
    document.getElementById("character_favorite").style.display = "none";
    document.getElementById("search-div").style.display = "none";
    var hero_row_div = document.getElementById("character_desc");
    hero_row_div.style.display = "block";
    var previous_element = hero_row_div.lastElementChild

    if (previous_element) {
        hero_row_div.removeChild(previous_element);
    }
    const div = document.createElement('div');
    div.className = 'col';
    let image = `${character.thumbnail.path}.${character.thumbnail.extension}`
    
    let series_str="";
    character.series.items.map((item) => {
        series_str += `<li>${item.name}</li>`
    })

    let comics_str="";
    character.comics.items.map((item) => {
        comics_str += `<li>${item.name}</li>`
    })

    let story_str="";
    character.stories.items.map((item) => {
        story_str += `<li>${item.name} - ${item.type}</li>`
    })

    let event_str="";
    character.events.items.map((item) => {
        event_str += `<li>${item.name}</li>`
    })

    div.innerHTML =
        `<div class="card">
        <h5 class="card-header">${character.name}</h5>
        <div class="card-body">
        <img class="card-img-top" src=${image} style="width: 40rem; alt="Card image cap">
        <h5 class="card-title">About ${character.name}
            
        </h5>
        <p>${character.description}</p>

        <a onclick={likeCharacter(this.id)} id=vl${character.id} class="btn btn-secondary"
        style = "background-color : ${getBgColourUsingId(character.id)};" value=${character.id} > Like </a>
        </div>

        <div>
        <h2>Series</h2>
        <ul>
        ${series_str}
        </ul>
        </div>

        <div>
        <h2>Comics</h2>
        <ul>
        ${comics_str}
        </ul>
        </div>

        <div>
        <h2>Stories</h2>
        <ul>
        ${story_str}
        </ul>
        </div>

        <div>
        <h2>Events</h2>
        <ul>
        ${event_str}
        </ul>
        </div>

        </div>`;

    hero_row_div.appendChild(div);
    // hero_row_div.appendChild(seriesDiv)

    var search_element = document.getElementById("dynamic_search");
    search_element.style.display = "none";

}




// This function will initilize all our elemts
function initializeRows(characters) {
    var existing_div= document.getElementById("child_hero_rows")
    // existing_div.remove()
    var hero_row_div = document.getElementById("hero_row");
    var search_element = document.getElementById("dynamic_search");

    let character;
    for (character of characters) {
        const div = document.createElement('div');
        const search_div = document.createElement("div")
        div.className = 'col';
        div.id = "child_hero_rows";
        // search_div.id=
        // console.log(character,"chare")

        let image = `${character.thumbnail.path}.${character.thumbnail.extension}`
        div.innerHTML =
            `<div class="card" style="width: 21rem;">
        <img class="card-img-top" src=${image} alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${character.name}</h5>
    
            <a onclick={getCharacter(this.id)} id=v${character.id} class="btn btn-primary" value=${character.id} >View desc</a>
            <a onclick={likeCharacter(this.id)} id=il${character.id} class="btn btn-secondary"
             style = "background-color : ${getBgColourUsingId(character.id)};" value=${character.id} > Like </a>
        </div>`;

    
        hero_row_div.appendChild(div);

        search_div.innerHTML = `<div id=s${character.id} 
        onclick={searchviewCharacter(this.id)} style="display : none;" > <h3>${character.name}</h3>
        <hr></div>`;

        search_element.appendChild(search_div);


    }

}






initialFetch();
