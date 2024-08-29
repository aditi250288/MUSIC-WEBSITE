import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Library = () => {
  const [libraryData, setLibraryData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/spotify/library', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setLibraryData(response.data);
      } catch (error) {
        console.error('Error fetching library data:', error);
        setError('Failed to fetch library data. Please try again.');
      }
    };

    fetchLibraryData();
  }, []);

  if (error) {
    return React.createElement('div', null, error);
  }

  if (!libraryData) {
    return React.createElement('div', null, 'Loading...');
  }

  const renderTracks = () => {
    return React.createElement('div', null, 
      React.createElement('h2', null, 'Tracks'),
      React.createElement('ul', null, 
        libraryData.tracks.map(track => 
          React.createElement('li', { key: track.track.id }, track.track.name)
        )
      )
    );
  };

  const renderAlbums = () => {
    return React.createElement('div', null, 
      React.createElement('h2', null, 'Albums'),
      React.createElement('ul', null, 
        libraryData.albums.map(album => 
          React.createElement('li', { key: album.album.id }, album.album.name)
        )
      )
    );
  };

  const renderPlaylists = () => {
    return React.createElement('div', null, 
      React.createElement('h2', null, 'Playlists'),
      React.createElement('ul', null, 
        libraryData.playlists.map(playlist => 
          React.createElement('li', { key: playlist.id }, playlist.name)
        )
      )
    );
  };

  return React.createElement('div', null, 
    React.createElement('h1', null, 'Your Library'),
    renderTracks(),
    renderAlbums(),
    renderPlaylists()
  );
};

export default Library;