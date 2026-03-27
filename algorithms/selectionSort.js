function selectionSort(array) {
    const steps = [];
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            steps.push({ type: 'compare', indices: [minIdx, j] });
            
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            steps.push({ type: 'swap', indices: [i, minIdx] });
            
            let temp = array[i];
            array[i] = array[minIdx];
            array[minIdx] = temp;
        }
    }
    return steps;
}
