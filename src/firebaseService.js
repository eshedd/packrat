// firebaseService.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';

// Upload image function
export const uploadImage = async (file) => {
  if (!file) return;

  // Reference to the storage location in Firebase
  const storageRef = ref(storage, `images/${file.name}`);

  // Upload the file
  const snapshot = await uploadBytes(storageRef, file);

  // Get the download URL
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;  // Return the file's URL
};


// firebaseService.js
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Save image metadata to Firestore
export const saveImageData = async (imageURL, imageName) => {
  try {
    const docRef = await addDoc(collection(db, "images"), {
      url: imageURL,
      name: imageName,
      timestamp: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Search images by name
export const searchImages = async (searchTerm) => {
  const q = query(collection(db, "images"), where("name", "==", searchTerm));
  const querySnapshot = await getDocs(q);

  const results = [];
  querySnapshot.forEach((doc) => {
    results.push(doc.data());
  });

  return results;
};