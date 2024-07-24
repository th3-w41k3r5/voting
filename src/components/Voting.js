import React, { useState } from 'react';

const Voting = ({ names, onVote }) => {
  const [voter, setVoter] = useState('');
  const [selectedName, setSelectedName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (voter && selectedName) {
      onVote(voter, selectedName);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Your Name:
        <input type="text" value={voter} onChange={(e) => setVoter(e.target.value)} />
      </label>
      <div>
        {names.map(name => (
          <label key={name}>
            <input
              type="radio"
              value={name}
              checked={selectedName === name}
              onChange={(e) => setSelectedName(e.target.value)}
            />
            {name}
          </label>
        ))}
      </div>
      <button type="submit">Vote</button>
    </form>
  );
};

export default Voting;
