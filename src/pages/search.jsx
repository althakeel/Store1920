import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Search = () => {
  const query = useQuery();
  const searchTerm = query.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        // Replace this with your API endpoint or use dummy data
        const response = await axios.get(
          `https://db.store1920.com/search?query=${encodeURIComponent(searchTerm)}`
        );
        setResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px',minHeight:'40vh' }}>
      <h2 style={{ marginBottom: '20px' }}>Search results for: "{searchTerm}"</h2>
      
      {loading && <p style={{ fontStyle: 'italic' }}>Loading...</p>}
      {!loading && results.length === 0 && <p>No results found.</p>}
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map((item, index) => (
          <li
            key={index}
            style={{
              marginBottom: '15px',
              borderBottom: '1px solid #ddd',
              paddingBottom: '10px',
            }}
          >
            <h3 style={{ margin: '5px 0' }}>{item.name}</h3>
            <p style={{ margin: '0', color: '#555' }}>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
