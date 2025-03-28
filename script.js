const routeData = {
  routeName: 'Route 1',
  tags: [
    { id: 'OEA2', name: 'Start', scanned: false, scanTime: null },
    { id: 'OEA3', name: 'Finsh', scanned: false, scanTime: null },
    // Add more tags as needed
  ],
};

// Save data to localStorage (in case the page reloads)
function saveData() {
  localStorage.setItem('routeData', JSON.stringify(routeData));
}

// Load data from localStorage (if available)
function loadData() {
  const savedData = localStorage.getItem('routeData');
  if (savedData) {
    Object.assign(routeData, JSON.parse(savedData));
  }
}

// Display the list of tags
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

// Mark a tag as scanned and store the time
function scanTag(index) {
  if (!routeData.tags[index].scanned) {
    const currentTime = new Date().toLocaleString();
    routeData.tags[index].scanned = true;
    routeData.tags[index].scanTime = currentTime;
    saveData();
    displayTags();
  }
}

// Generate the PDF report
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

  // Attach event to the Generate PDF button
  document.getElementById('generatePDF').addEventListener('click', generatePDF);
}

init();
