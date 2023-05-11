const pokemonContainer = document.querySelector(".pokemon-container")
const prevButton = document.querySelector(".prev")
const nextButton = document.querySelector(".next")
const pageSpan = document.querySelector(".page-index")
const spinner = document.querySelector(".spinner")

const ITEMS_PER_PAGE = 24
let page = 0
let max

const colours = {
	normal: "#A8A77A",
	fire: "#EE8130",
	water: "#6390F0",
	electric: "#F7D02C",
	grass: "#7AC74C",
	ice: "#96D9D6",
	fighting: "#C22E28",
	poison: "#A33EA1",
	ground: "#E2BF65",
	flying: "#A98FF3",
	psychic: "#F95587",
	bug: "#A6B91A",
	rock: "#B6A136",
	ghost: "#735797",
	dragon: "#6F35FC",
	dark: "#705746",
	steel: "#B7B7CE",
	fairy: "#D685AD",
}

async function getPokemons(offset, limit) {
	pageSpan.innerHTML = page + 1

	spinner.classList.remove("hidden")
	pageSpan.classList.add("hidden")
	nextButton.disabled = true
	prevButton.disabled = true

	const res = await fetch(
		`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`
	)
	const json = await res.json()
	max = json.count

	const pokemons = await Promise.all(
		json.results.map(async ({ url }) => {
			const pokemonRes = await fetch(url)
			return pokemonRes.json()
		})
	)

	spinner.classList.add("hidden")
	pageSpan.classList.remove("hidden")
	nextButton.disabled = false
	prevButton.disabled = false

	render(pokemons)
}

function render(pokemons) {
	pokemonContainer.innerHTML = null

	pokemons.forEach((pokemon) => {
		const card = `
		    <li class="card" onClick="this.classList.toggle('flipped')">
				<div class="front">
					<img
						src="${pokemon.sprites.front_default}"
						alt="${pokemon.name}"
						loading="lazy"
						class="sprite"
					/>
					<p class="name">${pokemon.name}</p>
				</div>

				<div class="back">
					<p class="name">${pokemon.name}</p>

					<div class="types">
						${pokemon.types
							.map(({ type }) => {
								return `<p class="type" style="background: ${
									colours[type.name] || "#777"
								};">${type.name}</p>`
							})
							.join("")}
					</div>

					<div class="stats">
						${pokemon.stats
							.map(({ base_stat, stat }) => {
								return `
								<p class="stat">
									${stat.name.replace("-", " ")}: 
									<b>${base_stat}</b>
								</p>
								`
							})
							.join("")}
					</div>
				</div>
		    </li>
		`

		pokemonContainer.innerHTML += card
	})
}

prevButton.addEventListener("click", () => {
	if (page - 1 < 0) return
	page--
	getPokemons(ITEMS_PER_PAGE * page, ITEMS_PER_PAGE)
})

nextButton.addEventListener("click", () => {
	if (page + 1 > Math.floor(max / ITEMS_PER_PAGE)) return
	page++
	getPokemons(ITEMS_PER_PAGE * page, ITEMS_PER_PAGE)
})

getPokemons(page * ITEMS_PER_PAGE, ITEMS_PER_PAGE)
