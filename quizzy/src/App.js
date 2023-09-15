import { useEffect,useState } from 'react';
import './App.css';
import { Auth } from './components/auth'; 
import {db} from "./(config)/firebase"
import {getDocs,collection, addDoc,deleteDoc,doc,updateDoc} from "firebase/firestore";


function App() {

  const[movieList,setMovieList]=useState([]);

  // Search ( new movie states )
  const [ newMovieTitle,setNewMovieTitle]= useState("");
  const [ newMovieReleaseDate, setNewMovieReleaseDate]=useState("");
  const [isNewMovieOscar,setIsNewMovieOscar]=useState(false);
// update state title
const [updatedTitle, setUpdatedTitle]=useState("");



  const moviesCollectionRef= collection(db,"movies");// to put in getDocs
  
  const getMovieList= async()=>{ // displays movies 

    // READ the data  | must have function instead of just useEffect cuz u can make function asynchronoous.
    // set movie list state to be equal to data.
    try{
      const data= await getDocs(moviesCollectionRef);
      const filteredData= data.docs.map((doc)=>({...doc.data(),id: doc.id}))// for each document , create an object with only specific "data" - shown by the ref var
      // ID atribute and sets it equal to teh ID (so we can locate :)
      console.log({filteredData});
      setMovieList(filteredData);
    }catch(err){
      console.error(err);
    }
  };
  
    const deleteMovie = async(id)=>{

      const movieDoc = doc(db,"movies",id)
      deleteDoc(movieDoc); getMovieList();
      }
    const updateMovieTitle = async(id)=>{
      const movieDoc=doc(db,"movies",id);
      await updateDoc(movieDoc, {title: updatedTitle}); getMovieList();
    }


  useEffect(()=>{
   
    getMovieList();// must call again since async
  },[]);

  const onSubmitMovie=async()=>{
    try{
      await addDoc(moviesCollectionRef,{title: newMovieTitle, 
      releaseDate: newMovieReleaseDate,
      receivedAnOscar:isNewMovieOscar,});
      getMovieList(); // so it refreshes the page


    }

    catch(err){
      console.error(err);
    }
  }

  
  return (
    <div className="App">
      Firebase Course
      <Auth/>
    <div>

      <input placeholder="Movie title" onChange={(e)=> setNewMovieTitle(e.target.value)}/>
      <input placeholder="Release Data" type="number" onChange={(e)=>setNewMovieReleaseDate(e.target.value)}/>
      <input type ="checkbox"
      checked={isNewMovieOscar}
       onChange={(e)=>setIsNewMovieOscar(e.target.checked)}
       
       
       /><label> Received an Oscar</label>
      <button onClick={onSubmitMovie}>Add Movie</button>
    </div>

      <div>
        {
          // make sure to make this into a new component next time :)
        }
        {movieList.map((movie)=>(
          <div>
            <h1 style={{color: movie.receivedAnOscar?"green":"red"}}>{movie.title}</h1>
            <p>Release Date: {movie.releaseDate}</p>
            
            <button onClick={()=> deleteMovie(movie.id)}> Delete  </button>
           
            <input placeholder="New title.." onChange={(e)=>setUpdatedTitle(e.target.value)}/>
            <button onClick={()=>updateMovieTitle(movie.id)}>Update Title </button>
            
            
            
            </div>

        ))}
      </div>
      

    </div>
  );
}

export default App;
