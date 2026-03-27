function bubbleSort(array) {
    const steps = [];
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            steps.push({ type: 'compare', indices: [j, j + 1] });
            
            if (array[j] > array[j + 1]) {
                steps.push({ type: 'swap', indices: [j, j + 1] });
                
                // Swap in our logical array
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
    return steps;
}
