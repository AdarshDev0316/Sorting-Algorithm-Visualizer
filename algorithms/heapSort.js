function heapSort(array) {
    const steps = [];
    let n = array.length;
    
    function heapify(arr, n, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        
        if (left < n) {
            steps.push({ type: 'compare', indices: [left, largest] });
            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }
        
        if (right < n) {
            steps.push({ type: 'compare', indices: [right, largest] });
            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }
        
        if (largest !== i) {
            steps.push({ type: 'swap', indices: [i, largest] });
            
            let temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;
            
            heapify(arr, n, largest);
        }
    }
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(array, n, i);
    }
    
    for (let i = n - 1; i > 0; i--) {
        steps.push({ type: 'swap', indices: [0, i] });
        
        let temp = array[0];
        array[0] = array[i];
        array[i] = temp;
        
        heapify(array, i, 0);
    }
    
    return steps;
}
