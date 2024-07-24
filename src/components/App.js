import React, { useState, useEffect } from 'react';
import Voting from './Voting';
import Results from './Results';
import FinalName from './FinalName';
import Modal from './Modal';

const App = () => {
  const [names, setNames] = useState([]);
  const [roundComplete, setRoundComplete] = useState(false);
  const [finalName, setFinalName] = useState(null);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/names')
      .then(response => response.json())
      .then(data => setNames(data));
  }, []);

  const handleVote = (voter, name) => {
    fetch('http://localhost:5000/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voter, name })
    }).then(() => {
      setRoundComplete(true);
    });
  };

  const handleNextRound = () => {
    fetch('http://localhost:5000/next-round', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        if (data.winner) {
          setFinalName(data.winner);
        } else {
          if (Object.keys(data).length < 3) {
            setModalMessage(`Next round not started yet, only ${Object.keys(data).length}/3 people voted`);
          } else {
            fetch('http://localhost:5000/names')
              .then(response => response.json())
              .then(data => setNames(data));
            setRoundComplete(false);
          }
        }
      });
  };

  const closeModal = () => {
    setModalMessage('');
  };

  return (
    <div>
      <h1>Village Voting</h1>
      <div className="container">
        {!finalName ? (
          <>
            <Voting names={names} onVote={handleVote} />
            {roundComplete && <Results onNextRound={handleNextRound} />}
          </>
        ) : (
          <FinalName name={finalName} />
        )}
      </div>
      {modalMessage && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default App;

