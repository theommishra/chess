import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";

import wP from "../pieces/wP.png";
import bP from "../pieces/bP.png";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "GAME_OVER";

export const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [playerColor, setplayerColor] = useState("");

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          console.log(message.payload.color);
          setplayerColor(message.payload.color);
          console.log("Game initialized");
          break;
        case MOVE:
          const payload = message.payload;

          // Determine actual move object
          const move = payload.move || payload; // fallback if payload already has {from,to}

          if (move?.from && move?.to) {
            chess.move({ from: move.from, to: move.to });
            setBoard(chess.board());
            console.log("Move Made");
          } else {
            console.warn("Invalid move payload received:", message);
          }
          break;
      }
    };
  }, [socket, chess]);

  if (!socket) return <div>Connection !...</div>;

  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 bg-red-200 w-full flex justify-center">
            <ChessBoard
              chess={chess}
              playerColor={playerColor}
              setBoard={setBoard}
              socket={socket}
              board={board}
            />
          </div>
          <div className="col-span-2 bg-green-200 w-full flex justify-center">
            <div className="pt-8">
              <Button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                }}
              >
                Play
              </Button>
              <div className="mt-4 justify-center text-2xl text-black font-bold">
                Player Color: {playerColor.toUpperCase()}
              </div>
              <p className="mt-4 text-l text-black font-bold">
                Turn : {chess.turn() === "w" ? <img className="w-10" src={wP} alt="White Piece" /> : <img className="w-10" src={bP} alt="Black Piece" />}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
