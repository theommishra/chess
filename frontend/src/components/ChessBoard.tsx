import { useState } from "react";
import type { Square, PieceSymbol, Color } from "chess.js";

// Import piece images from src/pieces
import wP from "../pieces/wP.png";
import wR from "../pieces/wR.png";
import wN from "../pieces/wN.png";
import wB from "../pieces/wB.png";
import wQ from "../pieces/wQ.png";
import wK from "../pieces/wK.png";
import bP from "../pieces/bP.png";
import bR from "../pieces/bR.png";
import bN from "../pieces/bN.png";
import bB from "../pieces/bB.png";
import bQ from "../pieces/bQ.png";
import bK from "../pieces/bK.png";

const pieceImages: Record<string, string> = {
  wP,
  wR,
  wN,
  wB,
  wQ,
  wK,
  bP,
  bR,
  bN,
  bB,
  bQ,
  bK,
};

export const ChessBoard = ({
  chess,
  board,
  socket,
  setBoard,
  playerColor,
}: {
  chess: any;
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  playerColor: String;
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  const [legalMoves, setLegalMoves] = useState<
    { to: Square; captured?: PieceSymbol }[]
  >([]);

  const getPieceImage = (piece: { type: PieceSymbol; color: Color } | null) => {
    if (!piece || !piece.type || !piece.color) return "";
    const key = `${piece.color}${piece.type.toUpperCase()}`;
    return pieceImages[key];
  };

  const colorValidator = (pc: Color | undefined) => {
    if (!pc) return false;
    if (pc === "w" && playerColor === "white") return true;
    if (pc === "b" && playerColor === "black") return true;
    return false;
  };

  const handleSquareClick = (squareRepresentation: Square, square: any) => {
    // Clicked same square → deselect
    if (from === squareRepresentation) {
      setFrom(null);
      setLegalMoves([]);
      return;
    }

    // No square selected yet
    if (!from) {
      if (square && colorValidator(chess.get(squareRepresentation)?.color)) {
        setFrom(squareRepresentation);
        // get all legal moves for that piece
        const moves = chess
          .moves({ square: squareRepresentation, verbose: true })
          .map((m: any) => ({ to: m.to, captured: m.captured }));
        setLegalMoves(moves);
      }
      return;
    }

    // If another piece clicked — switch selection (don’t move yet)
    if (
      square &&
      chess.get(from)?.color === chess.get(squareRepresentation)?.color
    ) {
      setFrom(squareRepresentation);
      const moves = chess
        .moves({ square: squareRepresentation, verbose: true })
        .map((m: any) => ({ to: m.to, captured: m.captured }));
      setLegalMoves(moves);
      return;
    }

    // If clicked on a legal move square → execute move
    const move = legalMoves.find((m) => m.to === squareRepresentation);
    if (move && colorValidator(chess.get(from)?.color)) {
      try {
        const result = chess.move({ from, to: move.to });
        if (result) {
          socket.send(
            JSON.stringify({
              type: "move",
              payload: { move: { from, to: move.to } },
            })
          );
          setBoard(chess.board());
        }
      } catch (err) {
        console.error("Invalid move:", err);
      }
    }

    // Reset selection in all cases after clicking
    setFrom(null);
    setLegalMoves([]);
  };

  return (
    <div className="inline-block border border-gray-600">
      {board.map((row, i) => (
        <div className="flex" key={i}>
          {row.map((square, j) => {
            const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
              (8 - i)) as Square;
            const isDark = (i + j) % 2 === 1;
            const squareColor = isDark ? "bg-green-700" : "bg-green-300";
            const isSelected = from === squareRepresentation;

            // Find move info for this square
            const moveInfo = legalMoves.find(
              (m) => m.to === squareRepresentation
            );
            const isMoveHint = !!moveInfo;
            const isCaptureMove = moveInfo?.captured;

            return (
              <div
                key={j}
                onClick={() => handleSquareClick(squareRepresentation, square)}
                className={`${squareColor} w-16 h-16 flex items-center justify-center relative transition-all duration-150 ${
                  isSelected ? "bg-yellow-300" : ""
                }`}
              >
                {square && (
                  <img
                    src={getPieceImage(square)}
                    alt={`${square.color}${square.type}`}
                    className="w-12 h-12 select-none pointer-events-none"
                  />
                )}

                {/* Normal move hint */}
                {!square && isMoveHint && !isCaptureMove && (
                  <div className="absolute w-4 h-4 bg-black/40 rounded-full"></div>
                )}

                {/* Capture hint for enemy pieces */}
                {isCaptureMove && (
                  <div className="absolute w-14 h-14 border-4 border-red-500/70 rounded-full pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
