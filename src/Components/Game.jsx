import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "./CustomDialog";
import socket from "../socket";

function Game({ players, room, orientation, cleanup }) {
  const chess = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chess.fen());
  const [over, setOver] = useState("");

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move);
        console.log(result)
        setFen(chess.fen());
  
        console.log("over, checkmate", chess.game_over(), chess.in_checkmate());
  
        if (chess.game_over()) {
          if (chess.in_checkmate()) {
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "Black" : "White"} wins!`
            );
          } else if (chess.in_draw()) {
            setOver("Draw");
          } else {
            setOver("Game over");
          }
        }
  
        return result;
      } catch (e) {
        return null;
      }
    },
    [chess]
  );
  
  function onDrop(sourceSquare, targetSquare) {
    if (chess.turn() !== orientation[0]) return false;

    if (players.length < 2) return false;
    
    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q"
    };

    const move = makeAMove(moveData);

    if (move === null) return false;

    socket.emit("move", {
      move,
      room,
    });

    return true;
  }
  
  useEffect(() => {
    socket.on("move", (move) => {
      makeAMove(move); //
    });
  }, [makeAMove]);

  return (
    <>
      <div className="board" style={{
        maxWidth: 600,
        maxHeight: 600,
        flexGrow: 1,
      }}>
        <Chessboard position={fen} onPieceDrop={onDrop} />
      </div>
      <CustomDialog
        open={Boolean(over)}
        title={over}
        contentText={over}
        handleContinue={() => {
          setOver("");
        }}
      />
    </>
  );
}

export default Game;