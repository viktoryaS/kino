import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "d0959bef";
const tempQuery = 'interstellar'


export default function App() {

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLouding, setIsLouding] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id))
  }

  function handleCloseMovie() {
    setSelectedId(null);
    console.log('hi');
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched,movie]);
  }

  useEffect(function() {
    const controller = new AbortController();
    async function fetchMovies() {
      try {setIsLouding(true);
        setError("");

const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if(!res.ok) throw new Error("Что-то пошло не так с загрузкой фильмов")

          const data = await res.json();
          if(data.Response === "False") throw new Error('Фильм не найден')  
      setMovies(data.Search);
      // console.log(data.Search);
    } catch (err) {
  console.error(err.message);
  setError(err.message);
  } finally {
    setIsLouding(false);
  }
}
if(query.length < 3) {
  setMovies([]);
  setError("");
  return;
}
    fetchMovies();
  }, [query]);

//   useEffect(function() {
//     fetch(`http://www.omdbapi.com/?apikey=${KEY}&$=interstellar`)
// .then((res) => res.json())
// .then((data) => setMovies(data.Search));
//   }, []);




   return (
    <>
    {/* компонентная композиция children */}
  <NavBar>
    <Search query={query} setQuery={setQuery} />
    <NumResults movies={movies}/>
  </NavBar> 

  <Main>   
    <Box>
      {/* {isLouding ? <Loader /> : <MovieList movies={movies}/>} */}
      {isLouding && <Loader />}
      {!isLouding && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie}/>}
      {error && <ErrorMessage  message={error}/>}
    </Box>

    <Box>
      {selectedId ? (
        <MovieDetails 
        selectedId={selectedId} 
        onCloseMovie={handleCloseMovie}
        onAddWatched={handleAddWatched}
        /> 
      ) : ( 
      <>
      <WatchedSamummerey  watched={watched}/>
      <WatchedMoviesList watched={watched} />
      </>
      )}
    </Box>
  </Main>
   </>
  );
}

function MovieDetails({selectedId, onCloseMovie, onAddWatched}) {

const [movie, setMovie] = useState({});
const [isLouding, setIsLouding] = useState(false);
const [userRating, setUserRating] = useState("");

const {
  Title: title,
  Year: year,
  Poster: poster,
  Runtime: runtime,
  imdbRating,
  Plot: plot,
  Released: released,
  Actors: actors,
  Director: director,
  Genre: genre,
} = movie;

function handleAdd() {
  const newWatchedMovie = {
    imdbID: selectedId,
    title,
    year,
    poster,
    imdbRating: Number(imdbRating),
    runtime: Number(runtime.split(" ").at(0)),
    userRating,
  }
  onAddWatched(newWatchedMovie);
  onCloseMovie();
}

useEffect(function() {
  async function getMovieDetails() {
    setIsLouding(true);
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
      setIsLouding(false);
  }
  getMovieDetails();
}, [selectedId]);

  return (
  <div className="details">
    {isLouding ? (<Loader /> ) : (
    <>
  <header>
    <button className="btn-back" onClick={onCloseMovie}>
      &larr;
    </button>
    <img src={poster} alt={`Poster of ${movie} movie`} />
    <div className="details-overview">
      <h2>{title}</h2>
      <p>{released} &bull; {runtime}</p>
      <p><span>⭐️</span>{imdbRating} IMDb rating</p>
    </div>
    </header>
    <selection>
    <div className="rating"> 
    <StarRating 
    maxRating={10} 
    size={24}
    onSetRaing={setUserRating}/>
   
    {userRating > 0 && (
    <button className="btn-add" 
    onClick={handleAdd}> + Add to list
    </button>
    )}
    </div>
      <p><em>{plot}</em></p>
      <p>Starring {actors}</p>
      <p>Directed by {director}</p>
      </selection>
    </>
)}
    </div>
  )
}

function Loader() {
  return <p className="loader">Loading...</p>
}

function ErrorMessage({message}) {
  return (
  <p className="error" >
    <span>❌</span>{message}
  </p>
  )
}

// поиск
function Search({query, setQuery}) {

console.log(query);
  return (
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  )
}
// Логотип
function Logo() {
  return(
    <div className="logo">
    <span role="img">🎥</span>
    <h1>КиноПоиск</h1>
  </div>
  )
}

// подсчет поиска
function NumResults({movies}) {
  return (
  <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>
  )
}

// навигация
function NavBar({children}) {
 return (
    <nav className="nav-bar">
      <Logo />
      {children}
  </nav>
  )
}

// основной контент
function Main({children}) {

  return(
<main className="main">
    {children}
</main>
  )
}
// Лист с Фильмами
function MovieList({movies, onSelectMovie}) {

return (
    <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie movie={movie} key={movie.imdbID}
      onSelectMovie={onSelectMovie} />
    ))}
  </ul>
  )
}

// список Фильмов
function Movie({movie, onSelectMovie}) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)} >
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
  )
}
// список с выбраными фильмами
function Box({children}) {
  const [isOpen, setIsOpen] = useState(true);
  

  return (
    <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    {isOpen && children}
  </div>
  )
}

// список фильмов которые хочешь посмотреть
// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);


//   return (
//     <div className="box">
//     <button
//       className="btn-toggle"
//       onClick={() => setIsOpen2((open) => !open)}
//     >
//       {isOpen2 ? "–" : "+"}
//     </button>
//     {isOpen2 && (
//       <>
//        <WatchedSamummerey  watched={watched}/>
//        <WatchedMoviesList watched={watched} />
//        </>
//     )}
//   </div>
//   )
// }

function WatchedSamummerey({watched}) {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>
  )
}

function WatchedMoviesList({watched}) {
  return (
    <ul className="list">
    {watched.map((movie) => (
      <WatchedMovie movie={movie} key={movie.imdbID}/>
    ))}
  </ul>
  )
}

function WatchedMovie({movie}) {
  return (
    <li >
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h3>{movie.title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        </div>
      </li>
  )
}