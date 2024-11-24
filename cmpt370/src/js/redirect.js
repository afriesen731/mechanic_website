import { pb } from "../js/import_pb.js"

export async function verify(roles) {
    const user = pb.authStore.model;
    if (! (roles instanceof Array)) {
        roles = [roles];
    }

    if (!user) {
        // Redirect to login
        window.location.href = 'index.html';
        return;
    }

    // Fetch user data
    try {
        const userData = await pb.collection('users').getOne(user.id);

        // Check if the required field exists and meets your criteria
        if (roles.includes(userData.role)) {
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



/**
 * swiches the current shown frame
 * @param {String} prevFrame The id of the container to the iframe to switch to
 * @param {Number} prevScrollPosition The height to scroll to after switching to the frame
*/
export function returnToFrame(frameContainer, scrollPosition) {
    parent.showIframe(frameContainer);
    parent.window.scrollTo({
        top: scrollPosition,
    });
}

export function switchToFrame(frameId, frameContainer, frameSrc) {
    const iframe = parent.document.getElementById(frameId);
    
    iframe.src = frameSrc;
    parent.showIframe(frameContainer);
}

export function getParentScroll() {
    return parent.window.pageYOffset || parent.document.documentElement.scrollTop || parent.document.body.scrollTop
}


export function getIframeContainerId() {
    return window.frameElement.parentNode.id;
}