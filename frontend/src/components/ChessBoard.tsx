import type { Color, Square, PieceSymbol } from "chess.js";
import { useState } from "react";
// import { WebSocket } from "ws";

export const ChessBoard = ({ board, socket }: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
}) => {
    const [from, setFrom] = useState<null | Square>(null);
    return <div className="text-white-200 ">
        {
            board.map((row, i) => {
                return <div className="flex" key={i}>
                    {row.map((square, j) => {
                        return <div key={j} onClick={() => {
                            if (!from) {
                                setFrom(square?.square ?? null);
                            }
                            else {
                                const toSquare = square?.square ?? null;
                                socket.send(JSON.stringify({
                                    type: "move",
                                    payload:
                                    {
                                        from,
                                        to: toSquare
                            }
                                }))
                                console.log({
                                     from,
                                    to: toSquare
                                })
                                setFrom(null);
                            }
                        }} className={`w-16 h-16 ${(i + j) % 2 == 0 ? 'bg-slate-500' : 'bg-white'}`}>
                            <div className="w-full justify-center flex h-full">
                                <div className="h-full justify-center flex flex-col ">
                                    {square ? square.type : ""}

                                </div>

                            </div>
                        </div>
                    })}
                </div>
            })
        }

    </div>
}