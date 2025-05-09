const buttons = document.querySelectorAll('.button-container button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    })
});

fetch('characters.json')
.then(response => response.json())
.then(data => {
    const characters = data;

    // Variable to track current category (default 'all')
    let currentCategory = 'all';

    function displayCharacters(category) {
        const characterList = document.getElementById('character-list');
        characterList.innerHTML = ''; // Clear list

        let charactersToDisplay = [];
        if (category === 'all') {
            charactersToDisplay = [
                ...characters.DUELIST,
                ...characters.STRATEGIST,
                ...characters.VANGUARD
            ];
        } else {
            charactersToDisplay = characters[category.toUpperCase()];
        }

        // Create and display each character
        charactersToDisplay.forEach(character => {
            const li = document.createElement('li');
            li.textContent = character.name;
            characterList.appendChild(li);
        });
    }

    // Function to display random character
    function randomiseCharacter() {
        let charactersToRandomise = [];
        if (currentCategory === 'all') {
            charactersToRandomise = [
                ...characters.DUELIST,
                ...characters.STRATEGIST,
                ...characters.VANGUARD
            ];
        } else {
            charactersToRandomise = characters[currentCategory.toUpperCase()];
        }

        // Get random character from current category
        const randomCharacter = charactersToRandomise[Math.floor(Math.random() * charactersToRandomise.length)];

        // Clear list and display random character
        const characterList = document.getElementById('character-list');
        characterList.innerHTML = ''; // Clear list
        const li = document.createElement('li');
        li.textContent = randomCharacter.name;
        characterList.appendChild(li);
    }

    // Button event listeners for category selection
    document.getElementById('all').addEventListener('click', () => {
        currentCategory = 'all';
        displayCharacters('all');
    });
    document.getElementById('duelist').addEventListener('click', () => {
        currentCategory = 'duelist';
        displayCharacters('duelist');
    });
    document.getElementById('vanguard').addEventListener('click', () => {
        currentCategory = 'vanguard';
        displayCharacters('vanguard');
    });
    document.getElementById('strategist').addEventListener('click', () => {
        currentCategory = 'strategist';
        displayCharacters('strategist');
    });

    // Randomise button event listener
    document.getElementById('randomise').addEventListener('click', randomiseCharacter);

    // Display all characters by default
    displayCharacters('all');
})

.catch(error => {
    console.error('Error loading characters JSON file:', error);
});
