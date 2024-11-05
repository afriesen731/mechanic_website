import { pb } from "../js/import_pb.js"

export async function verify(role) {
    const user = pb.authStore.model;

    if (!user) {
        // Redirect to login
        window.location.href = 'index.html';
        return;
    }

    // Fetch user data
    try {
        const userData = await pb.collection('users').getOne(user.id);

        // Check if the required field exists and meets your criteria
        if (userData.role === role) {
            return;
        } else {
            // Redirect or show an error
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        window.location.href = 'index.html';
    }
}