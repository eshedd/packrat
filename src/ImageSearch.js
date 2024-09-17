// ImageSearch.js
import { useState } from 'react';
import { searchImages } from './firebaseService';

const ImageSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  // Handle search
  const handleSearch = async () => {
    const searchResults = await searchImages(searchTerm);
    setResults(searchResults);
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      <div>
        {results.map((result, index) => (
          <div key={index}>
            <img src={result.url} alt={result.name} width="100" />
            <p>{result.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSearch;
