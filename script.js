const API_key = 'd60183d6';
let filmes = [];

const buscador = document.getElementById('Buscador');
const botonBuscar = document.getElementById('Buscar');
const sortbotao = document.getElementById('sortbotao');
const stats = document.getElementById('stats');
const movielist = document.getElementById('movieList');
const details = document.getElementById('details');
const filtroTipo = document.getElementById('filtrotipo');

buscador.addEventListener("change", async () => {
    const texto = buscador.value.trim();
    if(!texto) return;
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(texto)}&apikey=${API_key}`;
    const resp = await fetch(url);
    const data = await resp.json();
    filmes = data.Search || [];
    mostrarmovies(filmes);
    mostrarEstatisticas(filmes);
});

 function mostrarmovies(lista){
    movielist.innerHTML = '';
  
    lista.forEach(filme => {
        const card = document.createElement("div")
        card.classList.add("card")
        card.innerHTML = ` <img src="${filme.Poster !== "N/A" ? filme.Poster : ''}" width="100%" alt="${filme.Title}">
      <h3>${filme.Title}</h3>
      <p>${filme.Type} • ${filme.Year}</p>`;
      movielist.appendChild(card);
      card.addEventListener("click", () => detalhesFilme(filme.imdbID));
    })
  };

   
   sortbotao.addEventListener("change", () => {
    let ordenado = [...filmes];

    if(sortbotao.value === "ano"){
       ordenado.sort((a, b) => Number(b.Year) - Number(a.Year));
    }
    if (sortbotao.value === "titulo"){
        ordenado.sort((a, b) => a.Title.localeCompare(b.Title));
    }
    mostrarmovies(ordenado);
});

 filtroTipo.addEventListener("change", () => {
    const tipo = filtroTipo.value;
     if (tipo === "all"){
        mostrarmovies(filmes);
        return;
     }      
    const filtrado = filmes.filter(filme => filme.Type === tipo);
    mostrarmovies(filtrado);
});

function mostrarEstatisticas(lista) {
  const total = lista.length;
  const anosValidos = lista.map(f => parseInt(f.Year)).filter(y => !isNaN(y));
  const mediaAno = anosValidos.length ? (anosValidos.reduce((a, b) => a + b, 0) / anosValidos.length) : 0;

  const qtdMovies = lista.filter(f => f.Type === "movie").length;
  const qtdSeries = lista.filter(f => f.Type === "series").length;
  const qtdGames = lista.filter(f => f.Type === "game").length;

  stats.innerHTML = `
    <p>Total: ${total}</p>
    <p>Média dos anos: ${mediaAno ? mediaAno.toFixed(1) : 'N/A'}</p>
    <p>Filmes: ${qtdMovies} / Séries: ${qtdSeries} / Games: ${qtdGames}</p>
  `;
}
 async function detalhesFilme(id) {
  const url = `https://www.omdbapi.com/?apikey=${API_key}&i=${id}&plot=full`;
  const resp = await fetch(url);
  const filme = await resp.json();

  details.innerHTML = `
    <h2>${filme.Title} (${filme.Year})</h2>
    <p><strong>Direção:</strong> ${filme.Director}</p>
    <p><strong>Gênero:</strong> ${filme.Genre}</p>
    <p><strong>Elenco:</strong> ${filme.Actors}</p>
    <p><strong>Nota IMDb:</strong> ${filme.imdbRating}</p>
    <p><strong>Duração:</strong> ${filme.Runtime}</p>
    <p><strong>Sinopse:</strong> ${filme.Plot}</p>
  `;
}