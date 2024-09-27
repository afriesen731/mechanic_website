import PocketBase from 'pocketbase';
// PocketBase SDK initialization
const pb = new PocketBase('http://ddmpmc.duckdns.org:8090');

const loginButton = document.getElementById('login-button');


// Function to handle user login
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Authenticate user via PocketBase
        const authData = await pb.collection('users').authWithPassword(username, password);
        
        // Redirect user based on role (admin, mechanic, viewer)
        if (authData.record.role === 'Admin') {
            window.location.href = 'admin.html';
        } else if (authData.record.role === 'Mechanic') {
            window.location.href = 'mechanic.html';
        } else if (authData.record.role === 'Viewer') {
            window.location.href = 'viewer.html';
        }
        console.log(authData);
    } catch (error) {
        document.getElementById('login-status').innerText = 'Login failed. Please try again.';
    }
}


loginButton.addEventListener('click', function(event) {
    login();
});