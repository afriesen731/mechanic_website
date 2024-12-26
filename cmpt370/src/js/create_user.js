import { pb } from "../js/import_pb.js"
import { detectSize } from "../js/display_iframe.js"







async function submit(username, name, password, role) {

    try {
            const newUser = await pb.collection('users').create({
                username: username,
                name: name,
                password: password,
                passwordConfirm: password,
                role: role,
            });

        document.getElementById("settings-form").reset();
        
        
        document.getElementById('result').innerText = `user \"${username}\" created`;

    } catch (error) {
        document.getElementById('result').innerText = 'Creation failed. Try a different username or password.';
    }
}















document.getElementById("settings-form").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    const role = document.getElementById("role-select").value;

    submit(username, name, password, role);

    
});

