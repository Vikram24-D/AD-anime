const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const status = document.getElementById("status");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    searchCharacter();
});

async function searchCharacter() {

    const query = input.value.trim();

    if (!query) {
        status.innerHTML = "Please enter a character name.";
        return;
    }

    status.innerHTML = "Searching...";
    results.innerHTML = "";

    try {

        const response = await fetch(
            `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}&limit=12`
        );

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            status.innerHTML = "No characters found.";
            return;
        }

        status.innerHTML = `Found ${data.data.length} character(s).`;

        results.innerHTML = data.data.map(character => {

            return `
            <div class="card">

                <img
                    src="${character.images.jpg.image_url}"
                    alt="${character.name}"
                    class="character-img"
                >

                <div class="card-body">

                    <h2>${character.name}</h2>

                    <p>
                    ${
                        character.about
                        ? character.about.substring(0,250).replace(/\n/g,"<br>") + "..."
                        : "No description available."
                    }
                    </p>

                    ${
                        character.favorites
                        ? `<p><strong>Favorites:</strong> ${character.favorites}</p>`
                        : ""
                    }

                </div>

            </div>
            `;

        }).join("");

    }
    catch(error){

        console.error(error);

        status.innerHTML = "Unable to connect to Jikan API.";

    }

}