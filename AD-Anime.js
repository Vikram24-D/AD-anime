// ---- Login guard: redirect to login if not signed in ----
function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true" ||
           sessionStorage.getItem("isLoggedIn") === "true";
}

if (!isLoggedIn()) {
    window.location.replace("Login.html");
}

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const statusEl = document.getElementById("status");

// ---- Logout ----
document.getElementById("logout-btn").addEventListener("click", function () {
    localStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = "Login.html";
});

// ---- Escape text before putting it in innerHTML ----
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// AniList descriptions contain HTML tags, __bold__ markers and ~!spoilers!~
function cleanDescription(text) {
    return text
        .replace(/~!.*?!~/gs, "")      // remove spoilers
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")       // strip other tags
        .replace(/[_*]{2}/g, "")       // strip bold markers
        .trim();
}

// ---- AniList GraphQL (free, no API key) ----
const ANILIST_URL = "https://graphql.anilist.co";

const SEARCH_QUERY = `
query ($search: String) {
  Page(perPage: 12) {
    characters(search: $search) {
      id
      name { full native }
      image { large }
      description
      favourites
    }
  }
}`;

form.addEventListener("submit", function (e) {
    e.preventDefault();
    searchCharacter();
});

async function searchCharacter() {
    const query = input.value.trim();

    if (!query) {
        statusEl.textContent = "Please enter a character name.";
        return;
    }

    statusEl.textContent = "Searching...";
    results.innerHTML = "";

    try {
        const response = await fetch(ANILIST_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query: SEARCH_QUERY,
                variables: { search: query }
            })
        });

        if (!response.ok) {
            statusEl.textContent = response.status === 429
                ? "Too many requests. Please wait a minute and try again."
                : `Server error (${response.status}). Please try again.`;
            return;
        }

        const json = await response.json();

        if (json.errors) {
            console.error(json.errors);
            statusEl.textContent = "The API returned an error. Please try again.";
            return;
        }

        const characters = json.data?.Page?.characters || [];

        if (characters.length === 0) {
            statusEl.textContent = "No characters found.";
            return;
        }

        statusEl.textContent = `Found ${characters.length} character(s).`;

        results.innerHTML = characters.map(character => {
            const name = escapeHtml(character.name.full);
            const native = character.name.native
                ? `<p class="card-sub">${escapeHtml(character.name.native)}</p>`
                : "";
            const img = character.image?.large || "";

            let about = "No description available.";
            if (character.description) {
                const text = cleanDescription(character.description);
                if (text) {
                    about = escapeHtml(text.length > 250 ? text.substring(0, 250) + "..." : text)
                        .replace(/\n/g, "<br>");
                }
            }

            return `
            <div class="card">
                <img src="${img}" alt="${name}" class="card-thumb" loading="lazy">
                <div class="card-body">
                    <div class="card-title">${name}</div>
                    ${native}
                    <p class="card-sub">${about}</p>
                    ${character.favourites
                        ? `<p><strong>Favorites:</strong> ${character.favourites}</p>`
                        : ""}
                </div>
            </div>`;
        }).join("");

    } catch (error) {
        console.error(error);
        statusEl.textContent = "Unable to connect to the anime API. Check your internet connection.";
    }
}
