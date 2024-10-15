// Dashboard JavaScript File

// Employees Data
let employees = [];
let employeeToRemove = null;

const realNames = [
    'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Hannah', 
    'Isaac', 'Jack', 'Katherine', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 
    'Quinn', 'Rachel', 'Sam', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xander', 
    'Yara', 'Zoe'
];

// Generate random employees for testing
function generateRandomEmployees() {
    for (let i = 0; i < realNames.length; i++) {
        const randomId = 'E' + String(i + 1).padStart(3, '0');
        const randomDate = `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
        const randomStatus = Math.random() > 0.5 ? 'Active' : 'Inactive';
        employees.push({ name: realNames[i], id: randomId, date: randomDate, status: randomStatus });
    }
}

// Render employee table
function renderEmployeeTable() {
    const tableBody = document.querySelector('#employee-table tbody');
    tableBody.innerHTML = ''; 

    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.id}</td>
            <td>${employee.date}</td>
            <td>${employee.status}</td>
            <td>
                <button class="action-btn" onclick="showModal(${index})">Remove</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}



// Show confirmation modal
function showModal(index) {
    employeeToRemove = index;
    document.getElementById('confirmation-modal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('confirmation-modal').style.display = 'none';
    employeeToRemove = null;
}

// Confirm removal and remove employee
function confirmRemove() {
    if (employeeToRemove !== null) {
        employees.splice(employeeToRemove, 1); // Remove the employee from the array
        renderEmployeeTable(); // Re-render the table
        employeeToRemove = null;
        closeModal(); // Close the modal
    }
}

// Redirect to the admin dashboard
function goToDashboard() {
    window.location.href = 'admin.html'; // Ensure you redirect to admin dashboard
}

// Show the correct page based on the menu clicked
function showPage(page) {
    const pages = document.querySelectorAll('.content-page'); // Select all content pages
    pages.forEach(p => p.style.display = 'none'); // Hide all pages
    document.getElementById(`${page}-page`).style.display = 'block'; // Show selected page
}

// Example function for employee search (you may want to customize it further)
function searchEmployee() {
    const input = document.querySelector('.search-bar').value.toLowerCase();
    const employeeRows = document.querySelectorAll('#employee-table tbody tr');
    
    employeeRows.forEach(row => {
        const name = row.querySelector('td').textContent.toLowerCase();
        row.style.display = name.includes(input) ? '' : 'none';
    });
}

// Switch between different pages in the dashboard
function showPage(page) {
    const pages = document.querySelectorAll('.content-page');
    pages.forEach(p => p.style.display = 'none');
    document.getElementById(`${page}-page`).style.display = 'block';
}

// Search employees
function searchEmployee() {
    const input = document.querySelector('.search-bar').value.toLowerCase();
    const filteredEmployees = employees.filter(employee => 
        employee.name.toLowerCase().includes(input) || 
        employee.id.toLowerCase().includes(input)
    );
    renderFilteredEmployeeTable(filteredEmployees);
}

// Render filtered employee table
function renderFilteredEmployeeTable(filteredEmployees) {
    const tableBody = document.querySelector('#employee-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    filteredEmployees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.id}</td>
            <td>${employee.date}</td>
            <td>${employee.status}</td>
            <td>
                <button class="action-btn" onclick="showModal(${index})">Remove</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Sort employees
function sortEmployees(order) {
    if (order === "asc") {
        employees.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === "desc") {
        employees.sort((a, b) => b.name.localeCompare(a.name));
    }
    renderEmployeeTable(); // Re-render the table after sorting
}

// Show the iframe with create_workorder.html
function showWorkOrderPage() {
    document.getElementById('workorder-iframe-container').style.display = 'block';
    document.getElementById('workorder-iframe').src = 'create_workorder.html';
}

// Initialize the employee table on page load and generate random employees
document.addEventListener('DOMContentLoaded', () => {
    generateRandomEmployees();
    renderEmployeeTable();

    // Event listener for "Create Work Order" button
    document.getElementById('create-workorder-btn').addEventListener('click', () => {
        showWorkOrderPage(); // Show the work order iframe
    });
});