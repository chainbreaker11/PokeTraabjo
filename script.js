const pokemonArray = [];//arreglo para el equipo pokemon 

const teamHistory = [];// Arreglo para el historial de equipos

document.getElementById('add').addEventListener('click', async function () {
    if (pokemonArray.length >= 3) {
        alert("¡El equipo ya tiene 3 Pokémon!");
        return;
    }
    const pokemonName = document.getElementById('name').value;
    try {
        const pokemonInfo = await getPokemon(pokemonName);
        if (pokemonInfo) {
            pokemonArray.push(pokemonInfo);
            clearInput();
            if (pokemonArray.length === 3) {
                disableSearchAndAddButton();
            }
        } else {
            alert("¡No se encontró el Pokémon!");
        }
    } catch (error) {
        alert(error.message);
    }
});

// boton reset
document.getElementById('reset').addEventListener('click', function () {
    resetPokemonArray();
});

//botón historial
document.getElementById('showHistory').addEventListener('click', function () {
    showTeamHistory();
});

async function getPokemon(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null; // Retorna null si el Pokémon no existe
            }
            throw new Error(`Error al buscar el Pokémon: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}
//funcion pa mostrar lso pokemones
async function displayAllPokemon() {
    const pokemonContainer = document.getElementById('pokemonContainer');
    pokemonContainer.innerHTML = '';

    pokemonArray.forEach(pokemon => {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon-card')

        pokemon.types.forEach(type => {
            pokemonDiv.classList.add(type.type.name);
        });

        pokemonDiv.innerHTML = `
            <img src="${pokemon.sprites.front_shiny}" alt="${pokemon.name}">
            <p>Name: ${pokemon.name}</p>
            <p>ID: ${pokemon.id}</p>
            <p>Type(s): ${pokemon.types.map(type => type.type.name).join(', ')}</p>
            <p>Ability: ${pokemon.abilities[0].ability.name}</p>
            <p>Base Experience: ${pokemon.base_experience}</p>
        `;
        pokemonContainer.appendChild(pokemonDiv);
    })

    // Agregar el equipo actual al historial antes de limpiar el arreglo
    teamHistory.push([...pokemonArray]);
    pokemonArray.length = 0;
}

document.getElementById('send').addEventListener('click', function () {
    displayAllPokemon();
});

function clearInput() {
    document.getElementById('name').value = '';
}

// Función para deshabilitar la barra de búsqueda y el botón de agregar
function disableSearchAndAddButton() {
    document.getElementById('name').disabled = true;
    document.getElementById('add').disabled = true;
}
// Función para habilitar la barra de búsqueda y el botón de agregar
function enableSearchAndAddButton() {
    document.getElementById('name').disabled = false;
    document.getElementById('add').disabled = false;
}


// Función para reiniciar el arreglo de Pokémon del equipo actual
function resetPokemonArray() {
    pokemonArray.length = 0;
    const pokemonContainer = document.getElementById('pokemonContainer');
    pokemonContainer.innerHTML = '';
    enableSearchAndAddButton(); // Habilitar la barra de búsqueda y el botón de agregar
}

let teamHistoryVisible = false; // Variable de estado para controlar la visibilidad del historial de equipos

function showTeamHistory() {
    const historyContainer = document.getElementById('historyContainer');

    if (teamHistoryVisible) {
        historyContainer.innerHTML = '';
        teamHistoryVisible = false;
        return;
    }

    // Si el historial de equipos no está visible, lo mostramos
    historyContainer.innerHTML = '';
    teamHistory.forEach((team, teamIndex) => {
        const teamDiv = document.createElement('div');
        teamDiv.classList.add('history-team'); // Agregar la clase para el estilo del equipo

        team.forEach((pokemon, pokemonIndex) => {
            const pokemonCardDiv = document.createElement('div');
            pokemonCardDiv.classList.add('pokemon-card'); // Agregar la clase para el estilo de la carta del Pokémon

            pokemon.types.forEach(type => {
                pokemonCardDiv.classList.add(type.type.name);
            });

            pokemonCardDiv.innerHTML = `
                <img src="${pokemon.sprites.front_shiny}" alt="${pokemon.name}">
                <p>Name: ${pokemon.name}</p>
                <p>ID: ${pokemon.id}</p>
                <p>Type: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                <p>Ability: ${pokemon.abilities[0].ability.name}</p>
                <p>Base Experience: ${pokemon.base_experience}</p>
            `;

            teamDiv.appendChild(pokemonCardDiv);
        });

        historyContainer.appendChild(teamDiv);
    });

    teamHistoryVisible = true;
}
