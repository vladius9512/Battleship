function createMatrix(n) {
    let matrix = [];
    for (let i = 0; i < n; i++) {
        matrix[i] = [];
        for (let j = 0; j < n; j++) {
            if (i === 0 && j >= 0 && j <= 5) {
                matrix[i][j] = 1;
            } else {
                matrix[i][j] = 0;
            }
        }
    }
    return matrix;
}

function checkSquaresHorizontal(matrix, start, length, row) {
    console.log(start, row);
    if (start > 0 && start < matrix.length - 1) {
        for (let j = row; j < row + length; j++) {
            if (matrix[start - 1][j] === 1 || matrix[start + 1][j] === 1) {
                return false;
            }
        }
    }
    if (start === 0 && start !== matrix.length - 1) {
        for (let j = row; j < row + length; j++) {
            if (matrix[start + 1][j] === 1) {
                return false;
            }
        }
    }
    if (start === matrix.length - 1) {
        for (let j = row; j < row + length; j++) {
            if (matrix[start - 1][j] === 1) {
                return false;
            }
        }
    }
    return true;
}

function checkSquaresVertical(matrix, start, length, col) {
    if (start > 0 && start < matrix.length - 1) {
        for (let i = col; i < col + length; i++) {
            if (matrix[i][start - 1] === 1 || matrix[i][start + 1] === 1) {
                return false;
            }
        }
    }
    if (start === 0) {
        for (let i = col; i < col + length; i++) {
            if (matrix[i][start + 1] === 1) {
                return false;
            }
        }
    }
    if (start === matrix.length - 1) {
        for (let i = col; i < col + length; i++) {
            if (matrix[i][start - 1] === 1) {
                return false;
            }
        }
    }
    return true;
}

module.exports = { checkSquaresHorizontal, checkSquaresVertical };
