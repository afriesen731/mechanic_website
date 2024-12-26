import { showIframe, updateIframes, reloadFrame, updateIframeSize } from "../js/display_iframe.js";
import { verify } from "../js/redirect.js"
import { pb } from "../js/import_pb.js";

// verify the user's role
verify('mechanic');

document.addEventListener('DOMContentLoaded', () => {


    // fllow function to be accessed by other Iframes
    window.showIframe = showIframe;

    // update iframes size when page changes size
    updateIframes();

    // show the initial iframe content
    reloadFrame('iframe-container-my-workorders');
});

const iframes = document.querySelectorAll('iframe');
updateIframeSize(iframes);