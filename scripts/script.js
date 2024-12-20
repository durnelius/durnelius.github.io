// Function to create and display cards dynamically
function createCards(cards) {
    const container = document.getElementById("cards-container");
    container.innerHTML = ''; // Clear existing cards

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        
        // Check if the card has a valid link, otherwise use '#' as fallback
        const hasLink = card.link && card.link !== ''; // Ensure link is not empty
        const descriptionText = card.description; // Just use the description as is
        const buttonLink = hasLink ? card.link : '#';  // If a link exists, use it; otherwise, fallback to '#'

        // Check if the card has a glow property and apply it if it exists
        const glow = card.glow; // Assuming glow is a hex value in the JSON
        if (glow && /^#[0-9A-F]{6}$/i.test(glow)) {
            cardElement.style.boxShadow = `0 0 15px 5px ${glow}`;
        }

        // Build the inner HTML for the card, conditionally including the description
        let cardContent = `
            <h3>${card.title}</h3>
            ${descriptionText ? `<p>${descriptionText}</p>` : ''}  <!-- Only show description if it exists -->
            <a href="${buttonLink}" class="button-link" target="_blank">
                <button class="card-button">Enter</button>
            </a>
        `;

        cardElement.innerHTML = cardContent;

        container.appendChild(cardElement);
    });
}

// Function to handle the search
function handleSearch(query) {
    console.log('Searching for:', query); // Debugging: Log search query

    // Filter the cards based on the search query
    const filteredCards = allCards.filter(card => {
        return card.title.toLowerCase().includes(query.toLowerCase()) || 
               card.description.toLowerCase().includes(query.toLowerCase());
    });

    console.log('Filtered Cards:', filteredCards); // Debugging: Log filtered cards

    // Create and display the filtered cards
    createCards(filteredCards);
}

// Load JSON data and create cards
let allCards = [];

// Fetch data from the JSON file
fetch('scripts/korteles.json')
    .then(response => response.json())
    .then(data => {
        allCards = data; // Store the fetched cards data
        createCards(data); // Initially create all cards
    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });

// Add event listener to the search bar to trigger the search function
document.getElementById('search-bar').addEventListener('input', (event) => {
    const searchQuery = event.target.value;  // Get the search query
    handleSearch(searchQuery);  // Call the search function with the query
});
