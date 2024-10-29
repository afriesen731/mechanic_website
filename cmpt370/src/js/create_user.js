import PocketBase from 'pocketbase';
// PocketBase SDK initialization
const pb = new PocketBase('http://ddmpmc.duckdns.org:8090');







async function submit(username, name, password, role) {

    try {
        // Authenticate user via PocketBase
            const newUser = await pb.collection('users').create({
                username: username,
                name: name,
                password: password,
                passwordConfirm: password,
                role: role,
            });

        document.getElementById("form").reset();
        
        
        document.getElementById('result').innerText = `user \"${username}\" created`;

    } catch (error) {
        document.getElementById('result').innerText = 'Creation failed. Try a different username or password.';
    }
}















document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    const role = document.getElementById("role-select").value;

    submit(username, name, password, role);

    
});

