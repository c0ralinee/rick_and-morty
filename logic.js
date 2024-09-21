let episodes = []; // Store the fetched episodes data
let filteredEpisodes = []; // Store the filtered episodes after applying filters (e.g., season)
let currentSortOrder = 'asc'; // Track sort order
const selectedSeasons = []; // Store selected seasons


// Load the JSON file
fetch('rick_and_morty_episodes.json')
    .then(response => response.json())
    .then(data => {
        episodes = data;
        filteredEpisodes = [...episodes]; // Initialize with all episodes
        displayEpisodes(filteredEpisodes);
    })
    .catch(error => console.error('Error loading the JSON file:', error));

// Function to display the episodes
function displayEpisodes(episodeList) {
    let container = document.getElementById('episode-container');
    container.innerHTML = ''; // Clear the current content

    episodeList.forEach(episode => {
        let card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img src="img/${episode.Image}" alt="Episode Image" class="episode-img">
            <h3>${episode.Name}</h3>
            <p><strong>Release Date:</strong> ${episode['Release Date']}</p>
            <p><strong>⭐ Rating:</strong> ${episode.Rating}</p>
            <p class="description">${episode.Description}</p>
            <a href="${episode.Link}" target="_blank">View Details</a>
        `;

        container.appendChild(card);

        // Extract dominant color and apply it to the card background
        let img = card.querySelector('.episode-img');
        let colorThief = new ColorThief();
        
        img.addEventListener('load', function () {
            let dominantColor = colorThief.getColor(img);
            card.style.backgroundColor = `rgb(${dominantColor.join(',')})`;
            
            let brightness = (0.299 * dominantColor[0]) + (0.587 * dominantColor[1]) + (0.114 * dominantColor[2]);
            if (brightness < 128) {
                card.style.color = "white";
            } else {
                card.style.color = "black";
            }
        });
    });
}

// Event listeners for the season checkboxes
document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            selectedSeasons.push(this.value);
        } else {
            const index = selectedSeasons.indexOf(this.value);
            if (index > -1) {
                selectedSeasons.splice(index, 1);
            }
        }
        filterBySeason(); // Call filter function whenever a season is selected/deselected
    });
});

// Function to filter episodes by season (based on checkboxes)
function filterBySeason() {
    // If no season is selected, display all episodes
    if (selectedSeasons.length === 0) {
        filteredEpisodes = [...episodes];
    } else {
        filteredEpisodes = episodes.filter(episode => {
            const episodeSeason = episode.Episode.match(/S(\d+)/)[1]; // Extract season number
            return selectedSeasons.includes(episodeSeason); // Only include episodes from selected seasons
        });
    }

    displayEpisodes(filteredEpisodes); // Re-render the filtered episodes
}

// Function to search episodes by name and description
function searchEpisodes() {
    const query = document.getElementById('search').value.toLowerCase();
    filteredEpisodes = episodes.filter(episode => 
        episode.Name.toLowerCase().includes(query) || 
        episode.Description.toLowerCase().includes(query)
    );
    displayEpisodes(filteredEpisodes);
}

// Function to sort episodes by rating
function sortEpisodes() {
    if (currentSortOrder === 'asc') {
        filteredEpisodes.sort((a, b) => parseFloat(b.Rating) - parseFloat(a.Rating));
        currentSortOrder = 'desc';
    } else {
        filteredEpisodes.sort((a, b) => parseFloat(a.Rating) - parseFloat(b.Rating));
        currentSortOrder = 'asc';
    }
    displayEpisodes(filteredEpisodes); // Sort the currently filtered episodes
}