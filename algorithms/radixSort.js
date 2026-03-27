function radixSort(array) {
    const steps = [];
    if (array.length === 0) return steps;
    
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] > max) max = array[i];
    }
    
    function countSortByDigit(arr, exp) {
        let output = new Array(arr.length);
        let count = new Array(10).fill(0);
        
        for (let i = 0; i < arr.length; i++) {
            let index = Math.floor(arr[i] / exp) % 10;
            count[index]++;
            steps.push({ type: 'compare', indices: [i, i] });
        }
        
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        
        for (let i = arr.length - 1; i >= 0; i--) {
            let index = Math.floor(arr[i] / exp) % 10;
            output[count[index] - 1] = arr[i];
            count[index]--;
        }
        
        for (let i = 0; i < arr.length; i++) {
            steps.push({ type: 'overwrite', indices: [i, output[i]] });
            arr[i] = output[i];
        }
    }
    
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        countSortByDigit(array, exp);
    }
    
    return steps;
}
