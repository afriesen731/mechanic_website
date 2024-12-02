import { pb } from "../js/import_pb.js"


/**
 * Verifies if the current user's role matches one of the specified roles. If not, redirects to the login page.
 *
 * @async
 * @param {String|String[]} roles - A single role or an array of roles to allow.
 * @returns {Promise<void>} Resolves if verification passes; otherwise, redirects to the login page.
 */
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

/**
 * Switches to a specified iframe within the parent page.
 *
 * @param {String} frameId - The ID of the iframe to switch to. 
 * @param {String} frameContainer - The container element that holds the iframe. 
 * @param {String} frameSrc - The path to the page to be loaded into the target iframe.
 */
export function switchToFrame(frameId, frameContainer, frameSrc) {
    const iframe = parent.document.getElementById(frameId);
    
    iframe.src = frameSrc;
    parent.showIframe(frameContainer);
}

/**
 * Retrieves the vertical scroll position of the parent window.
 * @returns {Number} The vertical scroll position of the parent window.
 */
export function getParentScroll() {
    return parent.window.pageYOffset || parent.document.documentElement.scrollTop || parent.document.body.scrollTop
}

/**
 * Gets the ID of the parent container of the current iframe.
 * @returns {String} The ID of the iframe's parent container.
 */
export function getIframeContainerId() {
    return window.frameElement.parentNode.id;
}


export function cleanAndReload() {
    const baseUrl = window.location.origin + window.location.pathname; 
    window.history.replaceState(null, '', baseUrl); 
    location.reload(); 
}