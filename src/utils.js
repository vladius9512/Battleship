function checkSquaresHorizontal(matrix, start, length, row) {
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
