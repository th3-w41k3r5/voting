const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());

const filePath = path.join(__dirname, 'villagename.txt');
let names = fs.readFileSync(filePath, 'utf-8').split('\n').map(name => name.trim()).filter(name => name);

let rounds = [];
let votes = [];
let currentRound = 0;

// Function to create sets of 3 names
const createRounds = () => {
  let shuffledNames = [...names].sort(() => 0.5 - Math.random());
  while (shuffledNames.length) {
    rounds.push(shuffledNames.splice(0, 3));
  }
};

createRounds();

app.get('/names', (req, res) => {
  res.json(rounds[currentRound] || []);
});

app.post('/vote', (req, res) => {
  const { voter, name } = req.body;
  if (!votes[currentRound]) votes[currentRound] = {};
  votes[currentRound][voter] = name;
  res.status(200).send('Vote submitted');
});

app.get('/results', (req, res) => {
  const currentVotes = votes[currentRound] || {};
  const voteCounts = (rounds[currentRound] || []).reduce((acc, name) => {
    acc[name] = Object.values(currentVotes).filter(vote => vote === name).length;
    return acc;
  }, {});
  res.json(voteCounts);
});

app.post('/next-round', (req, res) => {
  const currentVotes = votes[currentRound] || {};
  const voteCounts = (rounds[currentRound] || []).reduce((acc, name) => {
    acc[name] = Object.values(currentVotes).filter(vote => vote === name).length;
    return acc;
  }, {});

  const maxVotes = Math.max(...Object.values(voteCounts));
  const winners = Object.keys(voteCounts).filter(name => voteCounts[name] === maxVotes);

  if (currentRound < rounds.length - 1) {
    rounds[currentRound + 1].push(...winners);
    currentRound++;
    res.status(200).send('Next round started');
  } else if (winners.length === 1) {
    res.json({ winner: winners[0] });
  } else {
    rounds.push(winners);
    currentRound++;
    res.status(200).send('Next round started');
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

