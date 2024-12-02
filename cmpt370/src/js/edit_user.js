import { pb } from "../js/import_pb.js" 
import { returnToFrame } from "../js/redirect.js"
import { detectSize } from "../js/display_iframe.js"








const container = document.getElementById("order-container");
const backButton = document.getElementById("back-button");

// Url parameters
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");
const prevFrame = params.get("prevFrame");
// Save scroll position
const prevScrollPosition = params.get("prevScroll");


async function update(username, name, password, role, id) {

    try {


        if (password == '') {
            const newUser = await pb.collection('users').update(id, {
                username: username,
                name: name,
                role: role,
            });
    
        }
        else {
            const newUser = await pb.collection('users').update(id, {
                username: username,
                name: name,
                password: password,
                passwordConfirm: password,
                role: role,
            });
        }

        document.getElementById("settings-form").reset();
        
        
        document.getElementById('result').innerText = `user \"${username}\" updated`;

    } catch (error) {
        document.getElementById('result').innerText = 'update failed. Try a different username or password.';
    }
}


document.addEventListener("DOMContentLoaded", async e => {

    try {
        const user = await pb.collection("users").getOne(userId);

        document.getElementById("name").value = user.name || '';
        document.getElementById("username").value = user.username || '';
        document.getElementById("role-select").value = user.role || 'viewer';


        // Scroll to top
        parent.window.scrollTo({
            top: 0,
        });



        
        
    }
    catch (error) {
        container.innerHTML = error;
    }
});


backButton.addEventListener("click", e => {
    returnToFrame(prevFrame, prevScrollPosition);
});



document.getElementById("settings-form").addEventListener("submit", function(event) {
    event.preventDefault(); 
    const username = document.getElementById("username").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    const role = document.getElementById("role-select").value;



    update(username, name, password, role, userId);

    
});

detectSize()