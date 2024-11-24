function plantingTree(n, m, idx, k) {
    let maxLen = 0;
    for (let i = 0; i <= m - k; i++) {
        if (i === 0) {
            maxLen = Math.max(maxLen, idx[i + k] - 1);
        } else if (i === m - k) {
            maxLen = Math.max(maxLen, n - idx[i - 1]);
        } else {
            maxLen = Math.max(maxLen, idx[i + k] - idx[i - 1] - 1);
        }
    }
    console.log('maxLen', maxLen);
    return maxLen;
}

console.log(plantingTree(10, 3, [1, 2, 8], 2)); // 5