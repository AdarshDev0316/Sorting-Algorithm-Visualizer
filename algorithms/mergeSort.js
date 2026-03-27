function mergeSort(array) {
    const steps = [];
    
    function merge(arr, start, mid, end) {
        let n1 = mid - start + 1;
        let n2 = end - mid;
        
        let left = new Array(n1);
        let right = new Array(n2);
        
        for (let i = 0; i < n1; i++) left[i] = arr[start + i];
        for (let j = 0; j < n2; j++) right[j] = arr[mid + 1 + j];
        
        let i = 0, j = 0, k = start;
        
        while (i < n1 && j < n2) {
            steps.push({ type: 'compare', indices: [start + i, mid + 1 + j] });
            
            if (left[i] <= right[j]) {
                steps.push({ type: 'overwrite', indices: [k, left[i]] });
                arr[k] = left[i];
                i++;
            } else {
                steps.push({ type: 'overwrite', indices: [k, right[j]] });
                arr[k] = right[j];
                j++;
            }
            k++;
        }
        
        while (i < n1) {
            steps.push({ type: 'overwrite', indices: [k, left[i]] });
            arr[k] = left[i];
            i++;
            k++;
        }
        
        while (j < n2) {
            steps.push({ type: 'overwrite', indices: [k, right[j]] });
            arr[k] = right[j];
            j++;
            k++;
        }
    }
    
    function mergeSortRecursive(arr, start, end) {
        if (start >= end) return;
        
        let mid = start + Math.floor((end - start) / 2);
        mergeSortRecursive(arr, start, mid);
        mergeSortRecursive(arr, mid + 1, end);
        merge(arr, start, mid, end);
    }
    
    mergeSortRecursive(array, 0, array.length - 1);
    
    return steps;
}
