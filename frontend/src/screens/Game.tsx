import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";


export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "GAME_OVER";



export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            switch (message.type) {
                case INIT_GAME:
                    setBoard(chess.board())
                    console.log("Game initialized");
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move Made");
                    break;
                case GAME_OVER:
                    console.log("Game Over");
                    break;

            }
        }
    }, [socket, chess])


    if (!socket) return <div>
        Connection !...
    </div>

    return <div className="justify-center flex">
        <div className="pt-8 max-w-screen-lg w-full">
            <div className="grid grid-cols-6 gap-4 w-full" >
                <div className="col-span-4 bg-red-200 w-full flex justify-center">
                    <ChessBoard chess={chess}  setBoard={setBoard} socket={socket} board={board} />
                </div>
                <div className="col-span-2 bg-green-200 w-full flex justify-center">
                    <div className="pt-8">

                        <Button onClick={() => {
                            socket.send(JSON.stringify({
                                type: INIT_GAME
                            }))
                        }}>Play
                        </Button>
                    </div>
                </div>

            </div>

        </div>

    </div>
}