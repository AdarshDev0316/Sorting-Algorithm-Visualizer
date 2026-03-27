function countingSort(array) {
    const steps = [];
    if (array.length === 0) return steps;
    
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] > max) max = array[i];
    }
    
    // Create the counting array and initialize visuals
    let countArray = new Array(max + 1).fill(0);
    // Initialize secondary count array UI elements
    // We only visualize if max is reasonable, say <= 200, but let's always dispatch
    steps.push({ type: 'count_init', array: [...countArray] });
    
    // Count occurrences
    for (let i = 0; i < array.length; i++) {
        steps.push({ type: 'compare', indices: [i, i] }); // highlight current element in main array
        countArray[array[i]]++;
        
        // Find max count to scale heights appropriately in UI
        let maxCount = Math.max(...countArray);
        
        // Update count array visualization
        steps.push({ type: 'count_update', indices: [array[i], countArray[array[i]], maxCount] });
    }
    
    // Reconstruct the sorted array
    let index = 0;
    for (let i = 0; i <= max; i++) {
        while (countArray[i] > 0) {
            steps.push({ type: 'overwrite', indices: [index, i] });
            
            countArray[i]--;
            // Find max count again
            let maxCount = Math.max(...countArray);
            if (maxCount === 0) maxCount = 1; // avoid divide by zero
            // update visualization
            steps.push({ type: 'count_update', indices: [i, countArray[i], maxCount] });
            
            index++;
        }
    }
    
    return steps;
}
