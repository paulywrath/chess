import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "./CustomDialog";
import socket from "../socket";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
  Box,
} from "@mui/material";

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

  useEffect(() => {
    socket.on('closeRoom', ({ roomId }) => {
      if (roomId === room) {
        cleanup();
      }
    });
  }, [room, cleanup]);

  useEffect(() => {
    socket.on('playerDisconnected', (player) => {
      setOver(`${player.username} has disconnected`);
    });
  }, []);

  return (
    <Stack>
      <Card>
        <CardContent>
          <Typography variant="h5">Room ID: {room}</Typography>
        </CardContent>
      </Card>
      <Stack flexDirection="row" sx={{ pt: 2 }}>
        <div className="board">
          <Chessboard boardOrientation={orientation} position={fen} onPieceDrop={onDrop} />
        </div>
        {players.length > 0 && (
          <Box>
            <List>
              <ListSubheader>Players</ListSubheader>
              {players.map((p) => (
                <ListItem key={p.id}>
                  <ListItemText primary={p.username} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Stack>
      <CustomDialog
        open={Boolean(over)}
        title={over}
        contentText={over}
        handleContinue={() => {
          socket.emit("closeRoom", { roomId: room });
          cleanup();
        }}
      />
    </Stack>
  );
}

export default Game;