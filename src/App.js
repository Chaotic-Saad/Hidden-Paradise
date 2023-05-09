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

  const handleChange = (event) => {
    setFile(event.target.files[0]);
   };

  const handleUpload = () => {
    if (!file) {
      console.log('No file selected');
      return;
    }
    //calling the const HandleChange upon clicking the handleupload button
    handleChange({target: {files: [file]}});
    //upload function firebase
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
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercent(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
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
      console.log("Data successfully added to Firestore!");
    } catch (error) {
      console.error("Error adding data to Firestore: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <br></br>
    <div>
      <label htmlFor="name">Name  : </label>
      <input type="text" id="name" name="name" />
    </div>
    <br></br>
    <div>
      <label htmlFor="email">Description of the POI: </label>
      <textarea rows="2" cols="50" type="text" id="description" name="description" />
    </div>
       <br></br>
           <div>
      <label htmlFor="name">Name of the POI: </label>
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
      <label htmlFor="category">Type of the POI : </label>
      <select id="category" name="category">
        <option value="cascade">Cascade</option>
        <option value="plage">Plage</option>
        <option value="point-de-vue">Point de vue</option>
        <option value="halte-routiere">Halte routiére</option>
        <option value="batiment-historique">Batiment historique</option>
        <option value="sculpture">Sculpture</option>
      </select>
    </div>
    <br></br>
    
    {/* /*<button type="submit">Submit</button> */}
          <input type="file" onChange={handleChange} accept="image/*" />

          <br></br>

          <button type="button" onClick={handleUpload} >
            Upload to Firebase
          </button>

          <p>{percent}% done</p>
      </form>
  );
}

export default App;
