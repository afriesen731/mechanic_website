import html2pdf from "html2pdf.js";

/**
 * Download a dom element as a file 
 * @param {HTMLElement} element element to download the contents of
 * @param {String} fileName the name of the file that will be downloaded
 */
export function downloadElement(element, fileName) {
    const options = {
        margin:       0.5,
        filename:     `${fileName}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
}