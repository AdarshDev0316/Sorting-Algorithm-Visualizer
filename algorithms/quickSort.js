function quickSort(array) {
    const steps = [];
    
    function partition(arr, low, high) {
        let pivot = arr[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            steps.push({ type: 'compare', indices: [j, high] });
            
            if (arr[j] < pivot) {
                i++;
                steps.push({ type: 'swap', indices: [i, j] });
                
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        steps.push({ type: 'swap', indices: [i + 1, high] });
        let temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        return i + 1;
    }
    
    function quickSortRecursive(arr, low, high) {
        if (low < high) {
            let pi = partition(arr, low, high);
            
            quickSortRecursive(arr, low, pi - 1);
            quickSortRecursive(arr, pi + 1, high);
        }
    }
    
    quickSortRecursive(array, 0, array.length - 1);
    
    return steps;
}
