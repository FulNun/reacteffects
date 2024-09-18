import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [deckId, setDeckId] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [card, setCard] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchDeck = async () => {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/');
      const data = await response.json();
      setDeckId(data.deck_id);
      setRemaining(data.remaining);
    };

    fetchDeck();
  }, []);

  const drawCard = async () => {
    if (remaining > 0) {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
      const data = await response.json();
      setCard(data.cards[0]);
      setRemaining(data.remaining);
    } else {
      alert('Error: no cards remaining!');
    }
  };

  const shuffleDeck = async () => {
    if (deckId) {
      await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
      setCard(null);
      setRemaining(52); // Reset to full deck
    }
  };

  const toggleDrawing = () => {
    if (isDrawing) {
      clearInterval(intervalRef.current);
      setIsDrawing(false);
    } else {
      setIsDrawing(true);
      intervalRef.current = setInterval(() => {
        drawCard();
      }, 1000);
    }
  };

  return (
    <div>
      <h1>Card Draw App</h1>
      {card && (
        <div className="card">
          <img src={card.image} alt={`${card.value} of ${card.suit}`} />
        </div>
      )}
      <button className="button" onClick={drawCard} disabled={isDrawing}>Draw Card</button>
      <button className="button" onClick={shuffleDeck}>Shuffle Deck</button>
      <button className="button" onClick={toggleDrawing}>
        {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
      </button>
    </div>
  );
};

export default App;
