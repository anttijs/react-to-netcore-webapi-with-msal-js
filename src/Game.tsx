import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
 
type Props = {}

interface SquareProps  {
  index: number
  text: string
  onClick(index: number, e: React.MouseEvent<Element,MouseEvent>): void 
}
/*
function Square(props: SquareProps){
    return (
      <button className="square" onClick={ () => props.onClick(props.index)}>
        { props.text }
      </button>
    )
}
*/
export const Square: React.FunctionComponent<SquareProps> = (props: SquareProps) => 
<button className="square" onClick={ (e) => props.onClick(props.index, e)}>
  { props.text }
</button>

interface GameStatusProps {
  isXNext: boolean
  resolved: boolean,
  winner: string,
  resetGame(): void
}
function GameStatus(props: GameStatusProps) {
  let button = <Button variant="danger" className="mr-1" onClick={props.resetGame}>Play again</Button>
  if (props.resolved) {
    return <div>The Winner is {props.winner} { button }</div>  
  }
  else {
    return <div>Next player: {props.isXNext ? "X" : "O"}</div>
  }
}

interface BoardProps {

}
interface BoardState {
  squareVal: string[],
  isXNext: boolean,
  resolved: boolean,
  winner: string
}
class Board extends React.Component<BoardProps,BoardState> {

  private initialState: BoardState = {squareVal: Array(9).fill(undefined), isXNext: true, resolved: false, winner: ''}
  constructor(props: BoardProps) {
    super(props)
    this.state = this.initialState
    this.onClick = this.onClick.bind(this)
    this.resetGame = this.resetGame.bind(this)
  }
  renderSquare(i: number) {
    return (
    <Square 
      index = {i} 
      text = {this.state.squareVal[i]}
      onClick = {this.onClick}  
    />
    )
  }
  nextSymbol(): string {
    return this.state.isXNext ? "X" : "O"
  }
  onClick(index: number): void {
    const x = this.state.squareVal.slice()
    if (x[index] === undefined && this.state.resolved === false) {
      x[index] = this.nextSymbol();;
      const newisXNext = !this.state.isXNext
      this.setState({squareVal: x, isXNext: newisXNext, winner: ''})

      const start: number[] = [0,3,6,0,1,2,0,2]
      const step:  number[] = [1,1,1,3,3,3,4,2]
      let i: number = 0
      for (i = 0; i<start.length; i++) {
        if (x[start[i]] === x[start[i]+step[i]]  && x[start[i]] === x[start[i]+2*step[i]] && x[start[i]]) {
          this.setState({ resolved: true, winner: x[start[i]] })
          alert('its a WIN!')
          break
        }  
      }
    } 
  }
  resetGame(): void {
    this.setState( this.initialState )
  }
  render() {
    return (
      <div>
        <GameStatus isXNext={this.state.isXNext} resolved={this.state.resolved} winner={this.state.winner} resetGame={this.resetGame}></GameStatus>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}


export default class Game extends React.Component<{},{}> {
  render() {
    return (
      <div className="game">
        <div className="game-board">
        <Board/>
        {this.props.children}
        </div>
      </div>
      
    )
  }
}