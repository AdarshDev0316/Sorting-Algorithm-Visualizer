function insertionSort(array) {
    const steps = [];
    const n = array.length;
    
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        
        steps.push({ type: 'compare', indices: [j, i] });
        
        while (j >= 0 && array[j] > key) {
            steps.push({ type: 'compare', indices: [j, j + 1] });
            steps.push({ type: 'swap', indices: [j, j + 1] });
            
            array[j + 1] = array[j];
            array[j] = key;
            j = j - 1;
        }
    }
    return steps;
}
