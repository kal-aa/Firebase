import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [movieList, setMovieList] = useState([]);
  const [user, setUser] = useState();
  const [movieTitle, setMovieTitle] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState(0);
  const [isOscar, setIsOscar] = useState(false);
  const moviesCollectionRef = collection(db, "movies");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getMovieList = async () => {
      try {
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setMovieList(filteredData);
      } catch (error) {
        console.error(error);
      }
    };

    getMovieList();
  }, [moviesCollectionRef]);

  const onSubmitMovie = async () => {
    if (!movieTitle || !releaseDate) {
      alert("please fill all fields");
      return;
    }

    try {
      await addDoc(moviesCollectionRef, {
        title: movieTitle,
        releaseDate: releaseDate,
        receivedAnOscar: isOscar,
        // userId: auth?.currentUser?.uid,
      });

      setMovieTitle("");
      setReleaseDate(0);
      setIsOscar(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
    } catch (error) {
      console.error(error);
    }
  };

  const updateMovieTitle = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, {
        title: updatedTitle,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">
      <Auth user={user} />

      <div>
        <div>
          <input
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            placeholder="Movie title"
          />
          <input
            value={releaseDate}
            onChange={(e) => setReleaseDate(Number(e.target.value))}
            placeholder="Release date"
            type="number"
          />

          <input
            checked={isOscar}
            onChange={(e) => setIsOscar(e.target.checked)}
            id="oscar"
            type="checkbox"
          />
          <label htmlFor="oscar">Received an Oscar</label>

          <button onClick={onSubmitMovie}>Submit Movie</button>
        </div>

        <div>
          {movieList.map((movie) => (
            <div key={movie.id}>
              <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
                {movie.title}
              </h1>
              <p>Date: {movie.releaseDate}</p>
              <button onClick={() => deleteMovie(movie.id)}>
                Delete Movie
              </button>
              <input
                onChange={(e) => setUpdatedTitle(e.target.value)}
                placeholder="new title..."
              />
              <button onClick={() => updateMovieTitle(movie.id)}>
                Update Title
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
