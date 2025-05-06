async function fetchAndDisplay(endpoint, elementId, labelKey) {
    const response = await fetch(`http://localhost:5000/api/bookings/analytics/${endpoint}`);
    const data = await response.json();
  
    const list = document.getElementById(elementId);
    list.innerHTML = '';
  
    data.forEach(item => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <span>${item._id || 'Unknown'}</span>
        <span class="badge bg-primary rounded-pill">${item.total}</span>
      `;
      list.appendChild(li);
    });
  }
  
  fetchAndDisplay('by-practitioner', 'practitionerAnalytics');
  fetchAndDisplay('by-service', 'serviceAnalytics');
  fetchAndDisplay('by-month', 'monthAnalytics');
  