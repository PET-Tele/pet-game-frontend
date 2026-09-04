import React from 'react';
// import PhaserGame from '../components/games/PhaserGame';
import Trivia from '../components/games/Trivia';
import { useParams } from 'react-router-dom';
// import GameEngine from '../components/games/whack/GameEngine';
import Whack from '../components/games/whack/Whack';

const GamePage = (props) => {
  const { id } = useParams();

  return (
    <div style={{overflowX: 'hidden'}}>
      { id === "67ad0635dc308dc17c534834" ? <Trivia gameId={id} userData={props.userData}/> : console.log(id) }
      { id === "67bdd42d267c2211b1857ed0" ? <Whack gameId={id} userData={props.userData}/> : console.log(id) }
    </div>
  );
};

export default GamePage;