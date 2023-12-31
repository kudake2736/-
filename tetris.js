document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('tetrisCanvas');
    const context = canvas.getContext('2d');

    const ROWS = 20;
    const COLS = 10;
    const BLOCK_SIZE = 30;
    const COLORS = [
        '#FF0000', // Red
        '#00FF00', // Green
        '#0000FF', // Blue
        '#FFFF00', // Yellow
        '#FFA500'  // Orange
    ];

    const SHAPES = [
        [[1, 1, 1, 1]],
        [[1, 1, 1], [1]],
        [[1, 1, 1], [0, 0, 1]],
        [[1, 1, 1], [0, 1]],
        [[1, 1], [1, 1]],
    ];

    const tetris = {
        grid: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
        currentBlock: null,
        score: 0
    };

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (tetris.grid[row][col] !== 0) {
                    context.fillStyle = COLORS[tetris.grid[row][col] - 1];
                    context.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }

        if (tetris.currentBlock) {
            const { shape, color, x, y } = tetris.currentBlock;
            context.fillStyle = color;
            for (let i = 0; i < shape.length; i++) {
                for (let j = 0; j < shape[i].length; j++) {
                    if (shape[i][j] !== 0) {
                        context.fillRect((x + j) * BLOCK_SIZE, (y + i) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    }
                }
            }
        }
    }

    function newBlock() {
        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const x = Math.floor(COLS / 2) - Math.floor(shape[0].length / 2);
        const y = 0;
        return { shape, color, x, y };
    }

    function collide() {
        const { shape, x, y } = tetris.currentBlock;
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (
                    shape[i][j] !== 0 &&
                    (y + i >= ROWS || x + j < 0 || x + j >= COLS || tetris.grid[y + i][x + j] !== 0)
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    function merge() {
        const { shape, x, y } = tetris.currentBlock;
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] !== 0) {
                    tetris.grid[y + i][x + j] = tetris.currentBlock.color;
                }
            }
        }
    }

    function rotate() {
        tetris.currentBlock.shape = tetris.currentBlock.shape[0].map((_, i) =>
            tetris.currentBlock.shape.map(row => row[i]).reverse()
        );
    }

    function move(dx, dy) {
        tetris.currentBlock.x += dx;
        tetris.currentBlock.y += dy;
        if (collide()) {
            tetris.currentBlock.x -= dx;
            tetris.currentBlock.y -= dy;
            return true;
        }
        return false;
    }

    function moveLeft() {
        move(-1, 0);
    }

    function moveRight() {
        move(1, 0);
    }

    function moveDown() {
        if (!move(0, 1)) {
            merge();
            clearLines();
            tetris.currentBlock = newBlock();
        }
    }

    function clearLines() {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (tetris.grid[row].every(cell => cell !== 0)) {
                tetris.grid.splice(row, 1);
                tetris.grid.unshift(Array(COLS).fill(0));
                tetris.score += 10;
            }
        }
    }

    function update() {
        moveDown();
    }

    function keyDownHandler(event) {
        switch (event.key) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowUp':
                rotate();
                break;
        }
    }

    document.addEventListener('keydown', keyDownHandler);

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    tetris.currentBlock = newBlock();
    gameLoop();
});
