// ImageUpload.js
import { useState } from 'react';
import { uploadImage, saveImageData } from './firebaseService';

const ImageUpload = () => {
  const [file, setFile] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size < 5 * 1024 * 1024) { // 5 MB limit
      setFile(selectedFile);
    } else {
      alert('File is too large or not selected.');
    }
  };

  // Handle file upload
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      // Upload image to Firebase Storage
      const imageURL = await uploadImage(file);

      // Save image data to Firestore
      await saveImageData(imageURL, file.name);

      alert('Image uploaded successfully!');
    } catch (error) {
      console.error("Upload failed: ", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default ImageUpload;
