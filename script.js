// Sample Route Data (replace this with your actual route data)
const routeData = {
  routeName: 'Route 1',
  tags: [
    { id: 'OEA2', name: 'Tag 1', scanned: false, scanTime: null },
    { id: 'OEA3', name: 'Tag 2', scanned: false, scanTime: null },
    { id: 'tag3', name: 'Tag 3', scanned: false, scanTime: null },
    { id: 'tag4', name: 'Tag 4', scanned: false, scanTime: null },
    // Add more tags as needed
  ],
};

// Save data to localStorage
function saveData() {
  localStorage.setItem('routeData', JSON.stringify(routeData));
}

// Load data from localStorage
function loadData() {
  const savedData = localStorage.getItem('routeData');
  if (savedData) {
    Object.assign(routeData, JSON.parse(savedData));
  }
}

// Display tags and their scan status
function displayTags() {
  const tagList = document.getElementById('tagList');
  tagList.innerHTML = ''; // Clear previous list
  routeData.tags.forEach((tag, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `${tag.name} - ${tag.scanned ? 'Scanned at ' + tag.scanTime : 'Not Scanned'}`;
    listItem.onclick = () => scanTag(index);
    tagList.appendChild(listItem);
  });
}

// Update the status of the scanned tag
function scanTag(index) {
  if (!routeData.tags[index].scanned) {
    const currentTime = new Date().toLocaleString();
    routeData.tags[index].scanned = true;
    routeData.tags[index].scanTime = currentTime;
    saveData();
    displayTags();
  }
}

// Function to start NFC scanning
async function startScan() {
  try {
    // Check if the Web NFC API is available
    if ('NFC' in window) {
      const nfcReader = new NDEFReader();
      
      // Start scanning NFC tags
      await nfcReader.scan();
      console.log('Scan started');

      // When a tag is read, this event will be triggered
      nfcReader.onreading = (event) => {
        const tag = event.tag;
        console.log('Scanned Tag:', tag);

        // Extract and log NFC tag ID
        const tagId = tag.id;
        
        // Update tag status in the list
        const currentTime = new Date().toLocaleString();
        updateTagStatus(tagId, currentTime);
      };

      // Handle NFC errors
      nfcReader.onerror = (error) => {
        console.error('Error during NFC scan:', error);
        alert('Failed to scan NFC tag: ' + error.message);
      };
    } else {
      alert('Web NFC API is not supported on this device.');
    }
  } catch (error) {
    console.error('Error starting NFC scan:', error);
    alert('Failed to start NFC scan: ' + error.message);
  }
}

// Update the tag status and display it in the list
function updateTagStatus(tagId, scanTime) {
  const tagIndex = routeData.tags.findIndex(tag => tag.id === tagId);
  if (tagIndex >= 0) {
    routeData.tags[tagIndex].scanned = true;
    routeData.tags[tagIndex].scanTime = scanTime;
    saveData();
    displayTags();
  }
}

// Function to generate and download a PDF report
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont('helvetica');
  doc.setFontSize(12);

  let yPosition = 10;
  doc.text('Patrol Route Report', 10, yPosition);
  yPosition += 10;

  routeData.tags.forEach((tag) => {
    doc.text(`${tag.name}: ${tag.scanned ? `Scanned at ${tag.scanTime}` : 'Not Scanned'}`, 10, yPosition);
    yPosition += 10;
  });

  doc.save('patrol_report.pdf');
}

// Initialize the app
function init() {
  loadData();
  displayTags();

  // Attach event listeners
  document.getElementById('startScanButton').addEventListener('click', startScan);
  document.getElementById('generatePDF').addEventListener('click', generatePDF);
}

init();
