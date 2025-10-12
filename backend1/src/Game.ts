import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME } from "./messages.js";

export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    public board : Chess;
    private startTime :Date;
    private moveCount = 0;

    constructor(player1:WebSocket,player2 : WebSocket){

        this.player1= player1;
        this.player2=player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload:{
                color:"white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload:{
                color:"black"
            }
        }))
    }

    makeMove(socket:WebSocket, move:{from:string; to :string;}){
        try{
            this.board.move(move);
            this.moveCount++;
        }
        catch(e){
            return;
        }
        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:this.board.turn()=="w" ? "black":"white"
                }
            }))
        if(this.board.moves.length %2 ===0){
            this.player2.send(JSON.stringify({
                type:move,
                payload:move
            }))
        } else{
            this.player2.emit(JSON.stringify({
                type:move,
                payload:move
            }))
        }
            return;
        }
    }
}