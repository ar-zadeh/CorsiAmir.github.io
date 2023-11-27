const gameContainer = document.getElementById("game-container");
const blocksContainer = document.getElementById("blocks-container");
const startButton = document.getElementById("start-button");
const doneButton = document.getElementById("done-button");
const feedback = document.getElementById("feedback");
const nextTestButton = document.getElementById("next-test");
const startTestButton = document.getElementById('startTestButton');

const numberOfBlocks = 9;
const blocks = [];
const blockSequence = [];
let userSequence = [];
let sequenceLength = 2;
let attempts = 0;
// Adjust the values according to your layout
const blockDiameter = 7; // as vmin (from CSS)
const containerSize = 80; // as vmin (from CSS)

// Calculate grid dimensions based on vmin
const cellSize = blockDiameter; // Assuming the cell size to be the block diameter
const numRows = Math.floor(containerSize / cellSize);
const numCols = numRows; // Square grid

// Create an array representing the grid
let grid = new Array(numRows);
for (let i = 0; i < numRows; i++) {
    grid[i] = new Array(numCols).fill(false); // false indicates unoccupied
}
const gridSize = 32;
const gridSpacing = 100 / gridSize;

function generateRandomPosition(block) {
  let randomRow, randomCol, isOccupied;

  do {
    randomRow = Math.floor(Math.random() * numRows);
    randomCol = Math.floor(Math.random() * numCols);
    isOccupied = grid[randomRow][randomCol];
  } while (isOccupied);

  grid[randomRow][randomCol] = true; // Mark this cell as occupied

  // Since the blocks-container covers the entire game-container,
  // we can directly position blocks based on the grid
  const vminToPixels = value => value * gameContainer.clientWidth / 100;
  const xPosition = vminToPixels(randomCol * cellSize);
  const yPosition = vminToPixels(randomRow * cellSize);

  block.style.left = `${xPosition}px`;
  block.style.top = `${yPosition}px`;
}

//document.addEventListener('click', function() {
//  html2canvas(document.body).then(canvas => {
//      const imgDataUrl = canvas.toDataURL("image/png");
//
//      // Sending AJAX request to Flask backend
//      fetch('http://localhost:5000/upload', {
//          method: 'POST',
//          headers: {
//              'Content-Type': 'application/x-www-form-urlencoded',
//          },
//          body: `image=${encodeURIComponent(imgDataUrl)}`
//      })
//      .then(response => response.json())
//      .then(data => {
//          console.log('Image saved:', data);
//      })
//      .catch((error) => {
//          console.error('Error:', error);
//      });
//  });
//});
const title = document.querySelector("h1");

for (let i = 0; i < numberOfBlocks; i++) {
  const block = document.createElement("div");
  block.classList.add("block", "hidden");
  generateRandomPosition(block);
  block.addEventListener("click", () => {
    if (!block.classList.contains("active")) return;
    userSequence.push(block);
    block.classList.toggle("highlight");
  });
  blocksContainer.appendChild(block);
  blocks.push(block);
}


  startButton.addEventListener("click", () => {
    blocks.forEach(block => block.classList.remove("hidden"));
    startButton.style.display = "none";
    title.style.display = "none";

    showSequence();
  });
startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  showSequence();
});

doneButton.addEventListener("click", () => {
  checkUserSequence();
  userSequence.forEach(block => {
    block.classList.remove("highlight");
  });
});
function downloadCsvFile(data, filename) {
  const csvData = new Blob([data], {type: 'text/csv;charset=utf-8;'});
  const csvUrl = URL.createObjectURL(csvData);
  const link = document.createElement('a');
  link.href = csvUrl;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function showSequence() {
  doneButton.style.display = "none";
  feedback.style.display = "none";
  userSequence = [];
  generateSequence();
  let index = 0;
  const userId = localStorage.getItem('userId');
  const interval = setInterval(() => {
    if (index < blockSequence.length) {
      blockSequence[index].classList.add("highlight");

      // Get the dimensions and position of the highlighted block
      const blockRect = blockSequence[index].getBoundingClientRect();

      // Save the highlighted block data
      processHighlightedBlocksData({
        index: index + 1,
        x: blockRect.x,
        y: blockRect.y,
        width: blockRect.width,
        height: blockRect.height,
        timestamp: new Date().getTime(),
        user_id: userId
      });

      setTimeout(() => {
        blockSequence[index].classList.remove("highlight");
        index++;
      }, 500);
    } else {
      clearInterval(interval);
      setTimeout(() => {
        blocks.forEach(block => block.classList.add("active"));
        doneButton.style.display = "block";
      }, 500);
    }
  }, 1000);
}
function processHighlightedBlocksData(data) {
  // Find the next available sequence number for the filename
  let sequenceNumber = 1;
  while (localStorage.getItem(`seq_${sequenceNumber}`) !== null) {
    sequenceNumber += 1;
  }

  // Save the JSON data to local storage to keep track of used sequence numbers
  localStorage.setItem(`seq_${sequenceNumber}`, JSON.stringify(data));
}

function generateSequence() {
  blockSequence.length = 0;
  let availableBlocks = [...blocks]; // Clone the blocks array

  for (let i = 0; i < sequenceLength; i++) {
    const randomIndex = Math.floor(Math.random() * availableBlocks.length);
    const selectedBlock = availableBlocks[randomIndex];
    blockSequence.push(selectedBlock);

    // Remove the selected block from the available blocks
    availableBlocks.splice(randomIndex, 1);
  }
}


function hideBlocks() {
  blocks.forEach(block => block.classList.add("hidden"));
}


function checkUserSequence() {
  blocks.forEach(block => block.classList.remove("active"));
  doneButton.style.display = "none";

  const isCorrect =
    userSequence.length === blockSequence.length &&
    userSequence.every((block, index) => block === blockSequence[index]);

  if (isCorrect) {
    feedback.textContent = "😃";
    sequenceLength++;
    attempts = 0;
  } else {
    feedback.textContent = "☹️"
    attempts++;
    if (attempts === 2) {
      setTimeout(() => hideBlocks(), 1000);
      feedback.textContent += ` Game Over! Your Corsi Block Span is ${sequenceLength - 1}.`;
      nextTestButton.style.display = "block";
      saveResults(sequenceLength-1);

    }
}
feedback.style.display = "block";
saveUserSequence(userSequence);
if (attempts < 2) { setTimeout(() => { showSequence(); }, 2000); } }

function saveUserSequence(userSequence) {
    const sequenceData = userSequence.map(block => {
        const index = blocks.indexOf(block);
        const rect = block.getBoundingClientRect();
        const userId = localStorage.getItem('userId');
        return {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height,
            time: new Date().getTime(),
            user_id: userId
        };
    });

    fetch('/save-user-sequence', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sequenceData)
    })
    .then(response => response.json())
    .then(data => console.log('Response:', data))
    .catch(error => console.error('Error:', error));
}

function gatherSequences() {
  const sequenceData = [];
  let sequenceNumber = 1;

  while (localStorage.getItem(`seq_${sequenceNumber}`) !== null) {
    const seq = JSON.parse(localStorage.getItem(`seq_${sequenceNumber}`));
    sequenceData.push(seq);
    sequenceNumber += 1;
  }

  return sequenceData;
}





//const startTutorialButton = document.getElementById("start-tutorial-button");
//startTutorialButton.addEventListener("click", function () {
//    window.location.href = "corsi_memory_test/corsi_memory_test.html";
//});

nextTestButton.addEventListener("click", function () {
  // Gather all sequences from local storage
  const allSequences = gatherSequences();

  // Convert the gathered sequences to CSV format
  const csvData = jsonToCsv(allSequences);

  // Download the CSV file
  downloadCsvFile(csvData, "all_sequences.csv");

  // Redirect to the next test
    window.location.href = "../index.html";

    // Clear local storage
    localStorage.clear();
});

function jsonToCsv(jsonData) {
  const replacer = (key, value) => (value === null ? '' : value);
  const header = Object.keys(jsonData[0]);
  const csv = [
    header.join(','),
    ...jsonData.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n');
  
  return csv;
}
function saveResults(seq) {
    const userId = localStorage.getItem('userId');
    const resultString = userSequence.map(block => blocks.indexOf(block) + 1).join(",");
    const resultObj = {
        type: 'corsiBlockSpan',
        user_id: userId,
        score: sequenceLength - 1,
        time: new Date().getTime(),
        sequence: resultString

    };

    // Sending the result object to the server
    fetch('/save-results', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultObj)
    })
    .then(response => response.json())
    .then(data => console.log('Response:', data))
    .catch(error => console.error('Error:', error));
}

