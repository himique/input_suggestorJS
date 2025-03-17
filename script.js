let searchNames = [
    { name: "Artem", secondName: "Bondarenko", age: 22, emp: "Developer", id: 1, desc: "I do, what i wanna do" },
    { name: "Hans", secondName: "Amamenko", age: 43, emp: "Waiter", id: 2, desc: "I love be a waiter" },
    { name: "Artem", secondName: "Smith", age: 30, emp: "Engineer", id: 3, desc: "Building the future" },
    { name: "Anna", secondName: "Bondarenko", age: 28, emp: "Designer", id: 4, desc: "Creating beautiful things" },
    { name: "John", secondName: "Doe", age: 35, emp: "Developer", id: 5, desc: "Coding all day" },
];

// No need for enteredArticles globally if we're building the strings directly

// Function to find objects by name (no changes needed)
function findObjectByName(arr, query) {
    query = query.toLowerCase();
    return arr.filter(item => item.name.toLowerCase().includes(query));
}

// Function to find objects by secondName (no changes needed)
function findObjectBySecondName(arr, query) {
    query = query.toLowerCase();
    return arr.filter(item => item.secondName.toLowerCase().includes(query));
}

// Function to find objects by emp (no changes needed)
function findObjectByEmp(arr, query) {
    query = query.toLowerCase();
    return arr.filter(item => item.emp.toLowerCase().includes(query));
}

// Function to get suggestions (modified to build suggestion strings directly)
function getSuggestions(arr, query) {
    let results = [];

    if (query.length > 0) {
        // Prioritize exact matches at the beginning
        results = results.concat(arr.filter(item =>
            item.name.toLowerCase().startsWith(query.toLowerCase()) ||
            item.secondName.toLowerCase().startsWith(query.toLowerCase()) ||
            item.emp.toLowerCase().startsWith(query.toLowerCase())
        ));

        // Add other matches
        results = results.concat(findObjectByName(arr, query));
        results = results.concat(findObjectBySecondName(arr, query));
        results = results.concat(findObjectByEmp(arr, query));
    }

    // Remove duplicates and build suggestion strings
    const uniqueSuggestions = [];
    const idsSeen = new Set();
    for (const item of results) {
        if (!idsSeen.has(item.id)) {
            idsSeen.add(item.id);
            uniqueSuggestions.push({
                suggestionString: `${item.name} ${item.secondName} (${item.emp})`, // Build the string here
                id: item.id  // Keep the ID for later use
            });
        }
    }

    return uniqueSuggestions; // Return array of objects with suggestionString and id
}
// Function to display suggestions (modified to work with suggestion strings)
function displaySuggestions(suggestions, resultsContainer) {
    resultsContainer.innerHTML = ''; // Clear previous results

    if (suggestions.length === 0) {
        resultsContainer.style.display = 'none';
        return;
    }

    suggestions.forEach(suggestion => { // No more index needed
        const div = document.createElement('div');
        div.textContent = suggestion.suggestionString; // Use the suggestionString
        div.dataset.id = suggestion.id; // Store the id

        div.addEventListener('click', function() {
            inputField.value = suggestion.suggestionString.split(" (")[0]; // Extract name and secondName
            resultsContainer.style.display = 'none';
            inputField.focus();
        });
        resultsContainer.appendChild(div);
    });

    resultsContainer.style.display = 'block';
}


// Event listener for input changes (no major changes needed)
const inputField = document.getElementById('myInput');
const resultsContainer = document.getElementById('autocomplete-results');
let selectedIndex = -1;

inputField.addEventListener('input', function() {
    const query = this.value;
    const suggestions = getSuggestions(searchNames, query); // Get the suggestions directly
    displaySuggestions(suggestions, resultsContainer);
    selectedIndex = -1;
});

// Event listener for keydown (modified to use suggestionString)
inputField.addEventListener('keydown', function(event) {
    const suggestions = resultsContainer.children;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedIndex = (selectedIndex + 1) % suggestions.length;
        updateSelection(suggestions, selectedIndex);

    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
        updateSelection(suggestions, selectedIndex);

    } else if (event.key === 'Enter' && selectedIndex !== -1) {
        event.preventDefault();
        const selectedSuggestion = suggestions[selectedIndex];
        if (selectedSuggestion) {
              const id = parseInt(selectedSuggestion.dataset.id, 10); // Parse to integer.
              const fullSuggestionString = selectedSuggestion.textContent // Extract the full suggestion string
              const nameAndSecondName = fullSuggestionString.split(" (")[0]; //spliting by '('
              inputField.value = nameAndSecondName; // Set the input field value

            resultsContainer.style.display = 'none';
        }
    } else if (event.key === "Escape") {
        resultsContainer.style.display = 'none';
    }
});

// Function to update selection (no changes needed)
function updateSelection(suggestions, index) {
    for (let i = 0; i < suggestions.length; i++) {
        suggestions[i].classList.remove('autocomplete-selected');
    }
    if (index >= 0) {
        suggestions[index].classList.add('autocomplete-selected');
    }
}

// Hide on outside click (no changes needed)
document.addEventListener('click', function(event) {
    if (!event.target.closest('.autocomplete-container')) {
        resultsContainer.style.display = 'none';
    }
});