import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = Dimensions.get('window').width / BOARD_WIDTH;

const TETROMINOES = {
  I: { blocks: [[0, 0], [1, 0], [2, 0], [3, 0]], color: '#00f0f0' },
  O: { blocks: [[0, 0], [1, 0], [0, 1], [1, 1]], color: '#f0f000' },
  T: { blocks: [[1, 0], [0, 1], [1, 1], [2, 1]], color: '#a000f0' },
  S: { blocks: [[1, 0], [2, 0], [0, 1], [1, 1]], color: '#00f000' },
  Z: { blocks: [[0, 0], [1, 0], [1, 1], [2, 1]], color: '#f00000' },
  J: { blocks: [[0, 0], [0, 1], [1, 1], [2, 1]], color: '#0000f0' },
  L: { blocks: [[2, 0], [0, 1], [1, 1], [2, 1]], color: '#f0a000' },
};

const randomTetromino = () => {
  const pieces = Object.values(TETROMINOES);
  return pieces[Math.floor(Math.random() * pieces.length)];
};

export default function TetrisGame() {
  const [board, setBoard] = useState(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)));
  const [currentPiece, setCurrentPiece] = useState(randomTetromino());
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [playerName, setPlayerName] = useState('');

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;
    const interval = setInterval(() => {
      moveDown();
    }, 800);
    return () => clearInterval(interval);
  }, [position, board, gameOver, isPaused]);

  const moveDown = () => {
    const newY = position.y + 1;
    if (canMove(currentPiece, { x: position.x, y: newY })) {
      setPosition({ ...position, y: newY });
    } else {
      placePiece();
    }
  };

  const moveLeft = () => {
    const newX = position.x - 1;
    if (canMove(currentPiece, { x: newX, y: position.y })) {
      setPosition({ ...position, x: newX });
    }
  };

  const moveRight = () => {
    const newX = position.x + 1;
    if (canMove(currentPiece, { x: newX, y: position.y })) {
      setPosition({ ...position, x: newX });
    }
  };

  const rotate = () => {
    const rotated = {
      blocks: currentPiece.blocks.map(([x, y]) => [-y, x]),
      color: currentPiece.color,
    };
    if (canMove(rotated, position)) {
      setCurrentPiece(rotated);
    }
  };

  const canMove = (piece, pos) => {
    return piece.blocks.every(([x, y]) => {
      const newX = pos.x + x;
      const newY = pos.y + y;
      return newX >= 0 && newX < BOARD_WIDTH && newY >= 0 && newY < BOARD_HEIGHT && !board[newY]?.[newX];
    });
  };

  const placePiece = () => {
    const newBoard = board.map(row => [...row]);
    currentPiece.blocks.forEach(([x, y]) => {
      const newY = position.y + y;
      const newX = position.x + x;
      if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
        newBoard[newY][newX] = currentPiece.color;
      }
    });

    // Check for line clears
    let linesCleared = 0;
    const clearedBoard = newBoard.filter(row => {
      if (row.every(cell => cell !== null)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    if (linesCleared > 0) {
      while (clearedBoard.length < BOARD_HEIGHT) {
        clearedBoard.unshift(Array(BOARD_WIDTH).fill(null));
      }
      setScore(score + linesCleared * 100);
    }

    setBoard(clearedBoard);
    const newPiece = randomTetromino();
    setCurrentPiece(newPiece);
    setPosition({ x: 3, y: 0 });

    if (!canMove(newPiece, { x: 3, y: 0 })) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)));
    setCurrentPiece(randomTetromino());
    setPosition({ x: 3, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  // High score persistence using AsyncStorage
  const HIGH_SCORE_KEY = '@tetris_highscores_v1';

  useEffect(() => {
    loadHighScores();
  }, []);

  async function loadHighScores() {
    try {
      const raw = await AsyncStorage.getItem(HIGH_SCORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setHighScores(parsed);
      }
    } catch (err) {
      // ignore
    }
  }

  async function saveHighScores(list) {
    try {
      await AsyncStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(list));
    } catch (err) {
      // ignore
    }
  }

  async function addHighScore(value) {
    try {
      const entry = typeof value === 'number' ? { name: 'Anonymous', score: value, date: Date.now() } : value;
      const list = [...highScores, entry];
      list.sort((a, b) => b.score - a.score);
      const top = list.slice(0, 10);
      setHighScores(top);
      await saveHighScores(top);
    } catch (err) {
      // ignore
    }
  }

  async function clearHighScores() {
    try {
      await AsyncStorage.removeItem(HIGH_SCORE_KEY);
      setHighScores([]);
    } catch (err) {
      // ignore
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TETRIS</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <View style={styles.leaderboard}>
        <Text style={styles.leaderTitle}>High Scores</Text>
          <ScrollView style={{ maxHeight: 120 }}>
            {highScores.length === 0 && <Text style={styles.leaderEmpty}>No high scores yet</Text>}
            {highScores.map((h, i) => (
              <Text key={i} style={styles.leaderItem}>{i + 1}. {h.name || 'Anonymous'} — {h.score}</Text>
            ))}
          </ScrollView>
        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearHighScores}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.boardContainer}>
        {board.map((row, y) => (
          <View key={y} style={styles.row}>
            {row.map((cell, x) => {
              let color = '#1a1a1a';
              if (cell) color = cell;
              else if (currentPiece && currentPiece.blocks.some(([bx, by]) => position.x + bx === x && position.y + by === y)) {
                color = currentPiece.color;
              }
              return <View key={`${y}-${x}`} style={[styles.cell, { backgroundColor: color }]} />;
            })}
          </View>
        ))}
      </View>

      {gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.gameOverSub}>Your score: {score}</Text>
          <TextInput
            placeholder="Enter name"
            value={playerName}
            onChangeText={setPlayerName}
            style={styles.nameInput}
            maxLength={20}
          />
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <TouchableOpacity
              style={[styles.button, { marginRight: 8 }]}
              onPress={async () => {
                const name = playerName.trim() || 'Anonymous';
                await addHighScore({ name, score, date: Date.now() });
                setPlayerName('');
                resetGame();
              }}
            >
              <Text style={styles.buttonText}>Save Score</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => { setPlayerName(''); resetGame(); }}>
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={moveLeft}>
          <Text style={styles.buttonText}>← LEFT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={rotate}>
          <Text style={styles.buttonText}>ROTATE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={moveRight}>
          <Text style={styles.buttonText}>RIGHT →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={moveDown}>
          <Text style={styles.buttonText}>↓ DROP</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={() => setIsPaused(!isPaused)}>
        <Text style={styles.buttonText}>{isPaused ? 'RESUME' : 'PAUSE'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    color: '#0f0',
    marginBottom: 20,
  },
  boardContainer: {
    borderWidth: 3,
    borderColor: '#0f0',
    backgroundColor: '#1a1a1a',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: '#333',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  gameOverText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#f00',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pauseButton: {
    marginTop: 20,
    backgroundColor: '#f0a000',
  },
  leaderboard: {
    width: '90%',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  leaderTitle: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 6,
  },
  leaderItem: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 2,
  },
  leaderEmpty: {
    color: '#888',
    fontSize: 13,
    marginVertical: 4,
  },
  nameInput: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  gameOverSub: {
    color: '#fff',
    marginBottom: 8,
  },
  clearButton: {
    backgroundColor: '#f04444',
    marginTop: 8,
  },
});
