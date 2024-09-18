import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './App.css';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

function App() {
  const [title, setTitle] = useState('');
  const [binId, setBinId] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags] = useState('Tags will auto populate...');
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image");
      return;
    }

    setIsUploading(true);
    setIsSuccess(false);

    try {
      const imageRef = ref(storage, `inventory/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, 'items'), {
        title,
        binId,
        description,
        imageUrl,
        tags: tags.split(',').map(tag => tag.trim())
      });

      setTitle('');
      setBinId('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
      setIsSuccess(true);

      setTimeout(() => {
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Error uploading item:", error);
      setIsSuccess(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="app">
      {isUploading && (
        <div className={`overlay ${isSuccess ? 'overlay-success' : ''}`}>
          {isSuccess ? (
            <>
              <div className="success-icon">✔</div>
              <p>Uploaded Successfully!</p>
            </>
          ) : (
            <>
              <div className="spinner"></div>
              <p>Uploading...</p>
            </>
          )}
        </div>
      )}
      <div className="form-container">
        <h1>Packrat</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="image-upload" className="image-upload-label">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <div className="upload-placeholder">Upload Image</div>
            )}
          </label>
          <input id="image-upload" type="file" onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />

          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Bin ID</label>
          <input type="text" value={binId} onChange={(e) => setBinId(e.target.value)} required />

          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>

          <label>Generated Tags</label>
          <input type="text" value={tags} readOnly />

          <button type="submit">Add Item</button>
        </form>
      </div>
    </div>
  );
}

export default App;
