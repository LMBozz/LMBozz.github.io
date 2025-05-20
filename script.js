const buttons = document.querySelectorAll('.button-container button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

fetch('characters.json')
.then(response => response.json())
.then(data => {
    const characters = data;
    const characterList = document.getElementById('character-list');
    const inputs = document.querySelectorAll('.settings-row input[type="number"]');
    const settingsMenu = document.getElementById('settings-menu');

    // Default state
    let currentCategory = sessionStorage.getItem('category') || 'all';

    function displayCharacters(category) {
        characterList.innerHTML = '';
        let charactersToDisplay = [];

        if (category === 'all') {
            charactersToDisplay = [
                ...characters.VANGUARD,
                ...characters.DUELIST,
                ...characters.STRATEGIST
            ];
        } else {
            charactersToDisplay = characters[category.toUpperCase()];
        }

        charactersToDisplay.forEach(character => {
            const card = document.createElement('div');
            card.className = 'character-card';

            const img = document.createElement('img');
            img.src = character.image;
            img.alt = character.name;

            card.appendChild(img);
            characterList.appendChild(card);
        });
    }

    
    let lastCharacter = null;

    function randomiseCharacter() {
        let charactersToRandomise = [];

        if (currentCategory === 'all') {
            charactersToRandomise = [
                ...characters.VANGUARD,
                ...characters.DUELIST,
                ...characters.STRATEGIST
            ];
        } else {
            charactersToRandomise = characters[currentCategory.toUpperCase()];
        }

        // If only one character, no point checking
        if (charactersToRandomise.length <= 1) {
            var randomCharacter = charactersToRandomise[0];
        } else {
            let attempts = 0;
            let randomCharacter;
            do {
                randomCharacter = charactersToRandomise[Math.floor(Math.random() * charactersToRandomise.length)];
                attempts++;
            } while (randomCharacter === lastCharacter && attempts < 10); // safety to avoid infinite loop
            lastCharacter = randomCharacter;
        }

        characterList.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'character-card';

        const img = document.createElement('img');
        img.src = lastCharacter.image;
        img.alt = lastCharacter.name;

        card.appendChild(img);
        characterList.appendChild(card);
    }

    // Restore input values from sessionStorage or default to 0
    const inputKeys = ['vanguard', 'duelist', 'strategist'];
    inputs.forEach((input, idx) => {
        const val = sessionStorage.getItem(inputKeys[idx]);
        input.value = val !== null ? val : 0;
    });

    // Restore settings menu open/close state without animation
    if (sessionStorage.getItem('settingsOpen') === 'true') {
        settingsMenu.classList.add('no-transition');
        settingsMenu.classList.add('show');
        void settingsMenu.offsetWidth; // force reflow
        settingsMenu.classList.remove('no-transition');
    }

    // Setup category button listeners and restore active one
    const categories = ['all', 'duelist', 'vanguard', 'strategist'];
    categories.forEach(cat => {
        const btn = document.getElementById(cat);
        btn.addEventListener('click', () => {
            currentCategory = cat;
            sessionStorage.setItem('category', cat);
            displayCharacters(cat);
        });
        if (currentCategory === cat) {
            btn.classList.add('active');
        }
    });

    document.getElementById('randomise').addEventListener('click', randomiseCharacter);

    displayCharacters(currentCategory);

    // Advanced settings
    const pickButton = document.getElementById('pick-button');
    const resetButton = document.getElementById('reset-button');

    function getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    pickButton.addEventListener('click', () => {
        if (window.getComputedStyle(settingsMenu).display !== 'flex') {
            return;
        }

        const vanguardCount = parseInt(inputs[0].value) || 0;
        const duelistCount = parseInt(inputs[1].value) || 0;
        const strategistCount = parseInt(inputs[2].value) || 0;

        sessionStorage.setItem('vanguard', vanguardCount);
        sessionStorage.setItem('duelist', duelistCount);
        sessionStorage.setItem('strategist', strategistCount);

        const selectedCharacters = [
            ...getRandomItems(characters.VANGUARD, vanguardCount),
            ...getRandomItems(characters.DUELIST, duelistCount),
            ...getRandomItems(characters.STRATEGIST, strategistCount),
        ];

        characterList.innerHTML = '';
        selectedCharacters.forEach(character => {
            const card = document.createElement('div');
            card.className = 'character-card';

            const img = document.createElement('img');
            img.src = character.image;
            img.alt = character.name;

            card.appendChild(img);
            characterList.appendChild(card);
        });
    });

    resetButton.addEventListener('click', () => {
        inputs.forEach((input, idx) => {
            input.value = 0;
            sessionStorage.setItem(inputKeys[idx], 0);
        });
    });

})
.catch(error => {
    console.error('Error loading characters JSON file:', error);
});

// Save input values immediately on change
const inputKeys = ['vanguard', 'duelist', 'strategist'];
document.querySelectorAll('.settings-row input[type="number"]').forEach((input, idx) => {
    const key = inputKeys[idx];
    input.addEventListener('input', () => {
        const max = 6;
        const min = 0;
        let value = parseInt(input.value, 10);

        if (isNaN(value)) {
            input.value = '';
        } else if (value > max) {
            input.value = max;
        } else if (value < min) {
            input.value = min;
        }

        // Save to sessionStorage immediately
        sessionStorage.setItem(key, input.value);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const settingsButton = document.getElementById('settings');
    const settingsMenu = document.getElementById('settings-menu');

    settingsButton.addEventListener('click', () => {
        settingsMenu.classList.toggle('show');
        sessionStorage.setItem('settingsOpen', settingsMenu.classList.contains('show'));
    });
});