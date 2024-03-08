if (!localStorage.getItem("level")) {
    localStorage.setItem("level", 1);
}

let pokemon = [];
const palabra = [];
const card_words = document.querySelector('.card_words');
const card_letters = document.querySelector('.card_letters');
const imgPokemon = document.querySelector('.imgPokemon');
const card_delete = document.querySelector('.card_delete');
const btnRemove = document.querySelector('.btnRemove');
const loader = document.querySelector('.loader');
let indice = 0;

asignarpokemon();

btnRemove.addEventListener("click", () => {
    cleanPokemon();
})


function asignarpokemon() {
    loader.style.display = "flex";
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=50")
        .then(response => response.json())
        .then(data => {
            let active = localStorage.getItem("level");

            for (i = 1; i < data.results.length + 1; i++) {
                if (i === parseInt(active)) {
                    pokemon = data.results[i - 1].name.toUpperCase().split('');
                    const url = data.results[i - 1].url;

                    // Obtener detalles adicionales del Pokémon
                    fetch(url)
                        .then(response => response.json())
                        .then(pokemonDetails => {
                            const image = pokemonDetails.sprites.front_default;
                            imgPokemon.src = image;
                            imgPokemon.addEventListener("load", () => {
                                loader.style.display = "none";
                            })
                        })
                        .catch(error => console.error("Error al obtener imagen del Pokémon:", error));
                }
            }
            cargarLetras();
            cargarArray();

        })
        .catch(error => console.error("Error al obtener datos:", error));
}



function cargarLetras() {
    const newPokemon = pokemon.slice();
    let inner = '';
    newPokemon.sort(randomNumber);

    newPokemon.forEach((letter) => {
        inner += `
        <button class="letter" value="${letter}">${letter}</button>
        `;
    });

    card_letters.innerHTML = inner;

    const letters = document.querySelectorAll('.letter');
    letters.forEach((letter) => {
        letter.addEventListener("click", (e) => asignar(e));
    });
}

function cargarPalabras() {
    let inner = '';

    palabra.forEach((letter) => {
        inner += `
                <input type="text" id="word_letter" value="${letter}" disabled></input>
                `;
    });

    card_words.innerHTML = inner;
}

function cargarArray() {
    for (i = 0; i < pokemon.length; i++) {
        palabra.push('');
    }
    cargarPalabras();
}

function asignar(e) {
    let letterBtn = e.target;
    letterBtn.setAttribute('disabled', true);

    for (i = 0; i < palabra.length; i++) {
        if (i == indice) {
            palabra[i] = letterBtn.value;

            cargarPalabras();
        }
    }

    if (palabra.length === pokemon.length) {
        if (validar()) {
            setTimeout(() => {
                showNext();
                card_delete.style.display = "none"
            }, 100)
        } else {
            card_delete.style.display = "flex"
        }
    }

    indice++;
};

function validar() {
    let countTrues = 0;
    for (let i = 0; i < pokemon.length; i++) {
        if (pokemon[i] === palabra[i]) {
            countTrues++;

        }

    }

    if (countTrues === pokemon.length) {
        return true;
    }

    return false;
}

function randomNumber() {
    return Math.random() - 0.5;
}

function showNext() {
    let active = localStorage.getItem("level");
    active++;
    localStorage.setItem("level", active);
    cleanPokemon();
}

function cleanPokemon() {
    let valor = pokemon.length;
    for (i = 0; i < valor; i++) {
        pokemon.shift();
        palabra.shift();
    }
    asignarpokemon();
    indice = 0;
    card_delete.style.display = "none"
}

