// Show the correct page based on the menu clicked
function showPage(page) {
    const pages = document.querySelectorAll('.content-page'); // Select all content pages
    pages.forEach(p => p.style.display = 'none'); // Hide all pages
    document.getElementById(`${page}-page`).style.display = 'block'; // Show selected page
}

// Function to show the Create Work Order iframe
function showIframe(frameId) {
    const pages = document.querySelectorAll('.content-page'); // Select all content pages
    pages.forEach(p => p.style.display = 'none'); // Hide all pages
    
    const iframe = document.getElementById(frameId); // Select the iframe
    document.getElementById(frameId).style.display = 'block'; // Show the iframe container
}

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
                <button class="action-btn" data-index="${index}">Remove</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners to the Remove buttons
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            showModal(index);
        });
    });
}

// Show confirmation modal
function showModal(index) {
    employeeToRemove = index;
    if (confirm("Are you sure you want to remove this employee?")) {
        confirmRemove();
    }
}

// Confirm removal and remove employee
function confirmRemove() {
    if (employeeToRemove !== null) {
        employees.splice(employeeToRemove, 1); // Remove the employee from the array
        renderEmployeeTable(); // Re-render the table
        employeeToRemove = null;
    }
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
                <button class="action-btn" data-index="${index}">Remove</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners to the Remove buttons for the filtered table
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            showModal(index);
        });
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

// Initialize the employee table on page load and generate random employees
document.addEventListener('DOMContentLoaded', () => {
    generateRandomEmployees();
    renderEmployeeTable();
});