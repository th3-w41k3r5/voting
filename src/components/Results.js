import React, { useEffect, useState } from 'react';

const Results = ({ onNextRound }) => {
  const [results, setResults] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/results')
      .then(response => response.json())
      .then(data => setResults(data));
  }, []);

  return (
    <div className="results">
      <h2>Results</h2>
      <ul>
        {Object.entries(results).map(([name, count]) => (
          <li key={name}>{name}: {count} votes</li>
        ))}
      </ul>
      <button onClick={onNextRound}>Next Round</button>
    </div>
  );
};

export default Results;
