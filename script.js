// --- DOM Elements ---
const arrayContainer = document.getElementById('arrayContainer');
const countArrayContainer = document.getElementById('countArrayContainer');
const sizeSlider = document.getElementById('arraySize');
const sizeValue = document.getElementById('sizeValue');
const speedSlider = document.getElementById('speedControl');
const speedValue = document.getElementById('speedValue');
const algoSelect = document.getElementById('algorithmSelect');

const generateBtn = document.getElementById('generateBtn');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stepBtn = document.getElementById('stepBtn');
const resetBtn = document.getElementById('resetBtn');

const toggleThemeBtn = document.getElementById('toggleTheme');
const toggleSoundBtn = document.getElementById('toggleSound');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
const soundOnIcon = document.getElementById('sound-on-icon');
const soundOffIcon = document.getElementById('sound-off-icon');

const algoTitle = document.getElementById('algoTitle');
const algoDescription = document.getElementById('algoDescription');
const timeBest = document.getElementById('timeBest');
const timeAverage = document.getElementById('timeAverage');
const timeWorst = document.getElementById('timeWorst');
const spaceWorst = document.getElementById('spaceWorst');
const comparisonsCountEl = document.getElementById('comparisonsCount');
const swapsCountEl = document.getElementById('swapsCount');

// --- Global State ---
let array = [];
let countArray = []; // For counting sort
let bars = []; // DOM elements
let countBars = []; // DOM elements for counting sort Array
let delayTime = 50; 
let isSorting = false;
let isPaused = false;
let isSoundOn = true;
let currentResolvePause = null;
let abortController = null;
let comparisonsCount = 0;
let swapsCount = 0;

// Algorithm Details mapping
const ALGO_DETAILS = {
    bubble: {
        title: "Bubble Sort",
        description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        time: { best: "O(n)", avg: "O(n²)", worst: "O(n²)" },
        space: "O(1)"
    },
    selection: {
        title: "Selection Sort",
        description: "An in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist of items and a sublist of the remaining unsorted items.",
        time: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)" },
        space: "O(1)"
    },
    insertion: {
        title: "Insertion Sort",
        description: "A simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.",
        time: { best: "O(n)", avg: "O(n²)", worst: "O(n²)" },
        space: "O(1)"
    },
    merge: {
        title: "Merge Sort",
        description: "An efficient, stable, divide-and-conquer algorithm. Most implementations produce a stable sort, which means that the order of equal elements is the same in the input and output.",
        time: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
        space: "O(n)"
    },
    quick: {
        title: "Quick Sort",
        description: "An efficient divide-and-conquer sorting algorithm. It works by selecting a 'pivot' element and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.",
        time: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)" },
        space: "O(log n)"
    },
    heap: {
        title: "Heap Sort",
        description: "A comparison-based sorting algorithm that uses a binary heap data structure. It divides its input into a sorted and an unsorted region, and iteratively shrinks the unsorted region.",
        time: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
        space: "O(1)"
    },
    counting: {
        title: "Counting Sort",
        description: "An integer sorting algorithm that operates by counting the number of objects that have each distinct key value, and using arithmetic on those counts to determine each key's position.",
        time: { best: "O(n + k)", avg: "O(n + k)", worst: "O(n + k)" },
        space: "O(k)"
    },
    radix: {
        title: "Radix Sort",
        description: "A non-comparative sorting algorithm that avoids comparison by creating and distributing elements into buckets according to their radix.",
        time: { best: "O(nk)", avg: "O(nk)", worst: "O(nk)" },
        space: "O(n + k)"
    }
};

// --- Audio Context for Sound Effects ---
let audioCtx = null;
function playNote(freq, type = 'sine') {
    if (!isSoundOn) return;
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtx.createOscillator();
    const node = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.value = freq;
    
    osc.connect(node);
    node.connect(audioCtx.destination);
    
    osc.start();
    node.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
    osc.stop(audioCtx.currentTime + 0.1);
}

// --- Array Generation & Rendering ---
function generateNewArray() {
    if (isSorting) return;
    
    const size = parseInt(sizeSlider.value);
    array = [];
    arrayContainer.innerHTML = '';
    bars = [];
    
    comparisonsCount = 0;
    swapsCount = 0;
    updateStats();

    // Reset Count Array if visible
    countArrayContainer.style.display = 'none';
    countArrayContainer.innerHTML = '';
    countBars = [];

    const containerWidth = arrayContainer.clientWidth;
    const padding = 2; // gap between bars
    let barWidth = (containerWidth / size) - padding;
    if (barWidth < 1) barWidth = 1;
    
    for (let i = 0; i < size; i++) {
        // Random value between 10 and 100 for percentage height
        const val = Math.floor(Math.random() * 95) + 5; 
        array.push(val);
        
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${val}%`;
        bar.style.width = `${barWidth}px`;
        
        // Only show value if width is large enough
        if (barWidth > 20) {
            bar.classList.add('show-value');
            const valSpan = document.createElement('span');
            valSpan.classList.add('array-bar-value');
            valSpan.innerText = val;
            bar.appendChild(valSpan);
        }
        
        arrayContainer.appendChild(bar);
        bars.push(bar);
    }
}

// --- Animation Engine ---
function updateSpeed() {
    // Speed from 1 to 100
    // If speed is 1 (slowest), delay is e.g. 500ms
    // If speed is 100 (fastest), delay is 1ms
    const speed = parseInt(speedSlider.value);
    delayTime = Math.floor(10000 / (speed * speed)); 
    if (delayTime < 1) delayTime = 1;

    let speedText = "Normal";
    if (speed < 30) speedText = "Slow";
    else if (speed > 80) speedText = "Fast";
    speedValue.innerText = speedText;
}

const sleep = () => {
    return new Promise(resolve => {
        setTimeout(resolve, delayTime);
    });
};

const waitForPause = async () => {
    while (isPaused) {
        await new Promise(resolve => {
            currentResolvePause = resolve;
        });
    }
};

const checkAbort = () => {
    if (abortController && abortController.signal.aborted) {
        throw new Error('Animation Aborted');
    }
};

async function executeSteps(steps) {
    for (let s = 0; s < steps.length; s++) {
        checkAbort();
        await waitForPause();
        
        const step = steps[s];
        
        if (step.type === 'compare') {
            const [i, j] = step.indices;
            if (bars[i]) bars[i].classList.add('bar-compare');
            if (bars[j]) bars[j].classList.add('bar-compare');
            
            comparisonsCount++;
            playNote(200 + (array[i] || 10) * 2);
            updateStats();
            
            await sleep();
            checkAbort();
            
            if (bars[i]) bars[i].classList.remove('bar-compare');
            if (bars[j]) bars[j].classList.remove('bar-compare');
        } 
        else if (step.type === 'swap' || step.type === 'overwrite') {
            const [i, j] = step.indices; // for swap, indices to swap. for overwrite, i is index, j is new value.
            
            if (step.type === 'swap') {
                if (bars[i]) bars[i].classList.add('bar-swap');
                if (bars[j]) bars[j].classList.add('bar-swap');
                
                // Audio
                playNote(400 + array[i] * 5, 'triangle');
                
                // DOM height swap
                const tempHeight = bars[i].style.height;
                bars[i].style.height = bars[j].style.height;
                bars[j].style.height = tempHeight;

                // Value swap
                if (bars[i].classList.contains('show-value')) {
                    const tempVal = bars[i].querySelector('.array-bar-value').innerText;
                    bars[i].querySelector('.array-bar-value').innerText = bars[j].querySelector('.array-bar-value').innerText;
                    bars[j].querySelector('.array-bar-value').innerText = tempVal;
                }
            } else { // overwrite
                if (bars[i]) {
                    bars[i].classList.add('bar-swap');
                    bars[i].style.height = `${j}%`;
                    if (bars[i].classList.contains('show-value')) {
                        bars[i].querySelector('.array-bar-value').innerText = j;
                    }
                    playNote(400 + j * 5, 'triangle');
                }
            }
            
            swapsCount++;
            updateStats();
            
            await sleep();
            checkAbort();
            
            if (step.type === 'swap') {
                if (bars[i]) bars[i].classList.remove('bar-swap');
                if (bars[j]) bars[j].classList.remove('bar-swap');
            } else {
                if (bars[i]) bars[i].classList.remove('bar-swap');
            }
        } 
        else if (step.type === 'sorted') {
            const [i] = step.indices;
            if (bars[i]) {
                bars[i].classList.add('bar-sorted');
                bars[i].classList.remove('bar-compare', 'bar-swap');
                playNote(600 + (array[i] || 10) * 5, 'square');
            }
            await sleep();
        }
        else if (step.type === 'count_init') {
            // Setup secondary rendering area for counting sort
            const countArr = step.array;
            countArrayContainer.style.display = 'flex';
            countArrayContainer.innerHTML = '';
            countBars = [];
            
            const containerWidth = countArrayContainer.clientWidth;
            const barWidth = Math.max(1, (containerWidth / countArr.length) - 2);
            
            for (let k = 0; k < countArr.length; k++) {
                const bar = document.createElement('div');
                bar.classList.add('array-bar');
                bar.style.height = `5%`; // initially tiny or based on max count
                bar.style.width = `${barWidth}px`;
                if (barWidth > 20) {
                    bar.classList.add('show-value');
                    const valSpan = document.createElement('span');
                    valSpan.classList.add('array-bar-value');
                    valSpan.innerText = countArr[k];
                    bar.appendChild(valSpan);
                }
                countArrayContainer.appendChild(bar);
                countBars.push({ el: bar, val: countArr[k] });
            }
        }
        else if (step.type === 'count_update') {
            const [idx, val, maxCount] = step.indices;
            if (countBars[idx]) {
                countBars[idx].el.classList.add('bar-swap');
                countBars[idx].val = val;
                // Height based on proportion of maxCount
                const heightPct = maxCount === 0 ? 5 : Math.max(5, (val / maxCount) * 95);
                countBars[idx].el.style.height = `${heightPct}%`;
                
                if (countBars[idx].el.classList.contains('show-value')) {
                    countBars[idx].el.querySelector('.array-bar-value').innerText = val;
                }
                
                playNote(200 + val * 20);
                await sleep();
                checkAbort();
                countBars[idx].el.classList.remove('bar-swap');
            }
        }
    }
}

function updateStats() {
    comparisonsCountEl.innerText = comparisonsCount;
    swapsCountEl.innerText = swapsCount;
}

// --- Controller Actions ---
async function startSorting() {
    if (isSorting) return;
    isSorting = true;
    isPaused = false;
    
    // UI Update
    generateBtn.disabled = true;
    startBtn.disabled = true;
    algoSelect.disabled = true;
    sizeSlider.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    pauseBtn.innerText = "Pause";
    stepBtn.disabled = true;

    // Reset sorted classes if array was previously sorted and not generated anew
    bars.forEach(b => {
        b.classList.remove('bar-sorted', 'bar-compare', 'bar-swap');
    });

    // Create abort controller
    abortController = new AbortController();

    try {
        const algo = algoSelect.value;
        let steps = [];
        const arrayCopy = [...array];
        
        // Call the appropriate algorithm to generate steps
        switch(algo) {
            case 'bubble': steps = bubbleSort(arrayCopy); break;
            case 'selection': steps = selectionSort(arrayCopy); break;
            case 'insertion': steps = insertionSort(arrayCopy); break;
            case 'merge': steps = mergeSort(arrayCopy); break;
            case 'quick': steps = quickSort(arrayCopy); break;
            case 'heap': steps = heapSort(arrayCopy); break;
            case 'counting': steps = countingSort(arrayCopy); break;
            case 'radix': steps = radixSort(arrayCopy); break;
        }

        // Execute generated steps
        await executeSteps(steps);
        
        // Final polish - make sure all are green if completed successfully
        for (let i = 0; i < bars.length; i++) {
            bars[i].classList.add('bar-sorted');
        }
        playNote(800, 'sine');

    } catch (e) {
        if (e.message !== 'Animation Aborted') {
            console.error(e);
        }
    } finally {
        isSorting = false;
        generateBtn.disabled = false;
        startBtn.disabled = false;
        algoSelect.disabled = false;
        sizeSlider.disabled = false;
        pauseBtn.disabled = true;
        stepBtn.disabled = true;
    }
}

function stopSorting() {
    if (abortController) {
        abortController.abort();
    }
    isSorting = false;
    isPaused = false;
    if (currentResolvePause) currentResolvePause(); // release if paused
    
    generateBtn.disabled = false;
    startBtn.disabled = false;
    algoSelect.disabled = false;
    sizeSlider.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    stepBtn.disabled = true;
    pauseBtn.innerText = "Pause";
    
    // Quick regenerate to cleanup
    generateNewArray();
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseBtn.innerText = "Resume";
        pauseBtn.classList.replace('btn-warning', 'btn-success');
        stepBtn.disabled = false;
    } else {
        pauseBtn.innerText = "Pause";
        pauseBtn.classList.replace('btn-success', 'btn-warning');
        stepBtn.disabled = true;
        if (currentResolvePause) {
            currentResolvePause();
            currentResolvePause = null;
        }
    }
}

function nextStep() {
    if (isPaused && currentResolvePause) {
        // Resolve the pause temporarily, but remain paused for the next step iteration
        const tempResolve = currentResolvePause;
        currentResolvePause = null;
        tempResolve();
    }
}

// --- UI Updates ---
function updateAlgorithmInfo() {
    const algo = algoSelect.value;
    const details = ALGO_DETAILS[algo];
    
    algoTitle.innerText = details.title;
    algoDescription.innerText = details.description;
    
    timeBest.innerText = details.time.best;
    timeAverage.innerText = details.time.avg;
    timeWorst.innerText = details.time.worst;
    spaceWorst.innerText = details.space;
}

// --- Event Listeners ---
window.onload = () => {
    updateSpeed();
    updateAlgorithmInfo();
    generateNewArray();
};

sizeSlider.addEventListener('input', () => {
    sizeValue.innerText = sizeSlider.value;
    generateNewArray();
});

speedSlider.addEventListener('input', updateSpeed);

algoSelect.addEventListener('change', () => {
    updateAlgorithmInfo();
    generateNewArray();
});

generateBtn.addEventListener('click', generateNewArray);
startBtn.addEventListener('click', startSorting);
pauseBtn.addEventListener('click', togglePause);
stepBtn.addEventListener('click', nextStep);
resetBtn.addEventListener('click', stopSorting);

toggleThemeBtn.addEventListener('click', () => {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    } else {
        body.setAttribute('data-theme', 'dark');
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    }
});

toggleSoundBtn.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    if (isSoundOn) {
        soundOnIcon.style.display = 'block';
        soundOffIcon.style.display = 'none';
    } else {
        soundOnIcon.style.display = 'none';
        soundOffIcon.style.display = 'block';
    }
});

// Windows resize handling for responsiveness of bars
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (!isSorting) {
            generateNewArray();
        }
    }, 200);
});
