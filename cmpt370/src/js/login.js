import PocketBase from 'pocketbase';
// PocketBase SDK initialization
const pb = new PocketBase('http://ddmpmc.duckdns.org:8090');


document.addEventListener('DOMContentLoaded', function(){
    const loginForm = document.getElementById('login');


    /**
     * logs a user into pocketbase and redirects them based on their role
     * @param {string} username 
     * @param {string} password 
     */
    async function login(username, password) {

        try {
            // Authenticate user via PocketBase
            const authData = await pb.collection('users')
                                    .authWithPassword(username, password);
            
            // Redirect user based on role (admin, mechanic, viewer)
            if (authData.record.role === 'admin') {
                window.location.href = 'admin.html';
            } else if (authData.record.role === 'mechanic') {
                window.location.href = 'mechanic.html';
            } else if (authData.record.role === 'viewer') {
                window.location.href = 'viewer.html';
            }
            console.log(authData);
        } catch (error) {
            document.getElementById('login-status').innerText = 'Login failed. Please try again.';
        }
    }


    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        login(username, password);

    });
});