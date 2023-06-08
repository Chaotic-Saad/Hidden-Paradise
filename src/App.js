import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { useState } from "react";

// Initialize Firebase app
firebase.initializeApp({
    apiKey: "AIzaSyBomr8NtsqAk-MUQIutAMra33Y_zd5U_8Y",
    authDomain: "hidden-paradis.firebaseapp.com",
    projectId: "hidden-paradis",
    storageBucket: "hidden-paradis.appspot.com",
});

// Get Firestore and Storage instances
const db = firebase.firestore();
const storage = firebase.storage();

function App() {
  const [file, setFile] = useState(null);
  const [percent, setPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleChange = (event) => {
  setFile(event.target.files[0]);
  };
  
  const handleUpload = () => {
  if (!file) {
  setErrorMessage('Aucun fichier sélectionné');
  return;
  }
  
  const storageRef = storage.ref();
  const namePOI = document.getElementsByName("namePOI")[0].value;
  const name = document.getElementsByName("name")[0].value;
  const categorySelect = document.getElementById("category");
  const category = categorySelect.options[categorySelect.selectedIndex].value;
  const fileRef = storageRef.child(`${category}/${namePOI}/${name}/${file.name}`);
  const uploadTask = fileRef.put(file);
  
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setPercent(progress);
    },
    (error) => {
      console.log(error);
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("Le fichier est disponible à l'adresse", downloadURL);
      });
    }
  );
  };
  
  const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  
  try {
    await db.collection("landmarks").add(data);
    console.log("Données ajoutées avec succès à Firestore !");
    
  } catch (error) {
    console.error("Erreur lors de l'ajout des données à Firestore : ", error);
  }
  };
  
  return (
  <form onSubmit={handleSubmit}>
  <br></br>
  <div>
  <label htmlFor="name">Nom : </label>
  <input type="text" id="name" name="name" />
  </div>
  <br></br>
  <div>
  <label htmlFor="email">Description du POI : </label>
  <textarea rows="2" cols="50" type="text" id="description" name="description" />
  </div>
  <br></br>
  <div>
  <label htmlFor="name">Nom du POI : </label>
  <input type="text" id="namePOI" name="namePOI" />
  </div>
  <br></br>
  <div>
  <label htmlFor="longitude">Longitude : </label>
  <input type="text" id="longitude" name="longitude" />
  </div>
  <br></br>
  <div>
  <label htmlFor="latitude">Altitude : </label>
  <input type="text" id="latitude" name="latitude" />
  </div>
  <br></br>
  <div>
  <label htmlFor="category">Type du POI : </label>
  <select id="category" name="category">
  <option value="cascade">Cascade</option>
  <option value="plage">Plage</option>
  <option value="point-de-vue">Point de vue</option>
  <option value="halte-routiere">Halte routière</option>
  <option value="batiment-historique">Bâtiment historique</option>
  <option value="sculpture">Sculpture</option>
  </select>
  </div>
  <br></br>
  
 
    <button type="submit">Soumettre le formulaire</button>
  
    <br></br>
    <br></br>
    <input type="file" onChange={handleChange} accept="image/*" />
    <button type="button" onClick={handleUpload} >Soumettre la photo</button>
  
    <br></br>
  
    {errorMessage && <p>{errorMessage}</p>}
    <p>{percent}% terminé</p>
  </form>
  );
  }
  
  export default App;
