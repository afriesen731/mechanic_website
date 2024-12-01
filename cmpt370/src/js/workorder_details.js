import { pb } from "../js/import_pb.js";

const workorderId = new URLSearchParams(window.location.search).get("order");
const prevFrame = new URLSearchParams(window.location.search).get("prevFrame");
const prevScrollPosition = new URLSearchParams(window.location.search).get("prevScroll");

const backButton = document.getElementById("back-button");
const jobList = document.getElementById("job-list");
const stopJobModal = document.getElementById("stop-job-modal");
const commentInput = document.getElementById("comment");
const partsUsedInput = document.getElementById("parts-used");
const confirmStopButton = document.getElementById("confirm-stop-button");
const cancelStopButton = document.getElementById("cancel-stop-button");

let activeTimers = {}; // Store timers for jobs
let selectedJobId = null; // To track the job being stopped

/**
 * Fetches and displays work-order details.
 */
async function fetchWorkOrderDetails() {
    try {
        const workOrder = await pb.collection("work_orders").getOne(workorderId);

        document.getElementById("workorder-id").textContent = workOrder.work_order_number || "N/A";
        document.getElementById("workorder-status").textContent = workOrder.status || "Unknown";

        displayJobs(workOrder.jobs || []);
    } catch (error) {
        console.error("Error fetching work order details:", error);
        alert("Failed to fetch work order details. Please try again.");
    }
}


/**
 * Displays the list of jobs for the work order.
 * @param {Array} jobs - List of jobs (JSON objects) associated with the work order.
 */
function displayJobs(jobs) {
    jobList.innerHTML = ""; // Clear existing jobs

    jobs.forEach((job, index) => {
        const jobItem = document.createElement("li");
        jobItem.className = "job-item";
        jobItem.dataset.jobId = index; // Use index if no unique ID

        const jobTitle = document.createElement("div");
        jobTitle.textContent = `${job.description || "Untitled Job"} (Status: ${job.status || "Unknown"})`;
        jobItem.appendChild(jobTitle);

        const timer = document.createElement("span");
        timer.className = "job-timer";
        timer.textContent = formatTime(job.hours || 0);
        timer.setAttribute("data-time", job.hours || 0);
        jobItem.appendChild(timer);

        const actions = createJobActions(index, job.status || "Pending");
        jobItem.appendChild(actions);

        jobList.appendChild(jobItem);
    });
}

/**
 * Creates action buttons for a job.
 * @param {Number} jobIndex - The index of the job in the jobs array.
 * @param {String} status - The current status of the job.
 * @returns {HTMLElement} - A container with action buttons.
 */
function createJobActions(jobIndex, status) {
    const actionContainer = document.createElement("div");
    actionContainer.className = "job-actions";

    if (status === "Pending" || status === "Paused") {
        const startButton = document.createElement("button");
        startButton.textContent = "Start";
        startButton.onclick = () => startJob(jobIndex);
        actionContainer.appendChild(startButton);
    }

    if (status === "In Progress") {
        const pauseButton = document.createElement("button");
        pauseButton.textContent = "Pause";
        pauseButton.onclick = () => pauseJob(jobIndex);
        actionContainer.appendChild(pauseButton);

        const stopButton = document.createElement("button");
        stopButton.textContent = "Stop";
        stopButton.onclick = () => showStopJobModal(jobIndex);
        actionContainer.appendChild(stopButton);
    }

    if (status === "Paused") {
        const resumeButton = document.createElement("button");
        resumeButton.textContent = "Resume";
        resumeButton.onclick = () => resumeJob(jobIndex);
        actionContainer.appendChild(resumeButton);
    }

    return actionContainer;
}

/**
 * Starts a job and begins its timer.
 * @param {Number} jobIndex - The index of the job to start.
 */
async function startJob(jobIndex) {
    try {
        await updateJobStatus(jobIndex, "In Progress");
        activeTimers[jobIndex] = setInterval(() => updateTimer(jobIndex), 1000);
        fetchWorkOrderDetails(); // Refresh the work order details
    } catch (error) {
        console.error("Error starting job:", error);
        alert("Failed to start the job. Please try again.");
    }
}

/**
 * Pauses a job and stops its timer.
 * @param {Number} jobIndex - The index of the job in the jobs array.
 */
async function pauseJob(jobIndex) {
    try {
        // Fetch the current work order
        const workOrder = await pb.collection("work_orders").getOne(workorderId);

        if (workOrder.jobs && workOrder.jobs[jobIndex]) {
            const job = workOrder.jobs[jobIndex];
            const jobItem = document.querySelector(`li[data-job-id="${jobIndex}"]`);
            const timer = jobItem.querySelector(".job-timer");

            // Save the current timer value into the job's "hours" attribute
            const elapsedSeconds = parseInt(timer.getAttribute("data-time"), 10) || 0;
            job.hours = elapsedSeconds; // Update hours in the JSON

            // Update the job's status to "Paused"
            job.status = "Paused";

            // Save the updated job data to PocketBase
            await pb.collection("work_orders").update(workorderId, {
                jobs: workOrder.jobs,
            });

            // Stop the timer
            clearInterval(activeTimers[jobIndex]);
            delete activeTimers[jobIndex];

            console.log(`Job ${jobIndex} paused with ${elapsedSeconds} seconds.`);
            fetchWorkOrderDetails();
        } else {
            console.error(`Job at index ${jobIndex} not found.`);
        }
    } catch (error) {
        console.error("Error pausing job:", error);
        alert("Failed to pause the job. Please try again.");
    }
}

async function resumeJob(jobIndex) {
    try {
        // Fetch the current work order
        const workOrder = await pb.collection("work_orders").getOne(workorderId);

        if (workOrder.jobs && workOrder.jobs[jobIndex]) {
            const job = workOrder.jobs[jobIndex];
            const savedSeconds = job.hours || 0; // Get saved hours or default to 0

            // Update the job's status to "In Progress"
            job.status = "In Progress";

            // Save the updated job data to PocketBase
            await pb.collection("work_orders").update(workorderId, {
                jobs: workOrder.jobs,
            });

            // Start the timer from the saved value
            activeTimers[jobIndex] = setInterval(() => updateTimer(jobIndex, savedSeconds), 1000);

            console.log(`Job ${jobIndex} resumed.`);
            fetchWorkOrderDetails();
        } else {
            console.error(`Job at index ${jobIndex} not found.`);
        }
    } catch (error) {
        console.error("Error resuming job:", error);
        alert("Failed to resume the job. Please try again.");
    }
}

/**
 * Shows the modal for stopping a job.
 * @param {String} jobId - The ID of the job to stop.
 */
function showStopJobModal(jobId) {
    selectedJobId = jobId;
    stopJobModal.style.display = "block";
}

/**
 * Handles stopping a job and recording its details.
 */
async function handleStopJob() {
    const comment = commentInput.value.trim();
    const partsUsed = partsUsedInput.value.trim();

    if (!comment) {
        alert("Comment is required to stop the job.");
        return;
    }

    try {
        // Fetch the current work order
        const workOrder = await pb.collection("work_orders").getOne(workorderId);

        // Update the job's status and add the comment/partsUsed
        const jobIndex = workOrder.jobs.findIndex(job => job.jobNumber === selectedJobId);
        if (jobIndex !== -1) {
            workOrder.jobs[jobIndex].status = "Completed";
            workOrder.jobs[jobIndex].comment = comment;
            workOrder.jobs[jobIndex].partsUsed = partsUsed;

            // Update the work order with the modified jobs array
            await pb.collection("work_orders").update(workorderId, {
                jobs: workOrder.jobs,
            });

            // Stop the timer for the completed job
            if (activeTimers[selectedJobId]) {
                clearInterval(activeTimers[selectedJobId]);
                delete activeTimers[selectedJobId];
            }

            // Clear modal inputs and close the modal
            commentInput.value = "";
            partsUsedInput.value = "";
            stopJobModal.style.display = "none";

            // Refresh work order details
            fetchWorkOrderDetails();
        } else {
            console.error(`Job with ID ${selectedJobId} not found.`);
        }
    } catch (error) {
        console.error("Error stopping job:", error);
        alert("Failed to stop the job. Please try again.");
    }
}

/**
 * Cancels stopping a job and hides the modal.
 */
function cancelStopJob() {
    stopJobModal.style.display = "none";
    commentInput.value = "";
    partsUsedInput.value = "";
}

/**
 * Updates the status of a job in the work order's jobs array.
 * @param {Number} jobIndex - The index of the job in the jobs array.
 * @param {String} status - The new status of the job.
 */
async function updateJobStatus(jobIndex, status) {
    try {
        // Fetch the current work order
        const workOrder = await pb.collection("work_orders").getOne(workorderId);

        // Update the job's status
        if (workOrder.jobs && workOrder.jobs[jobIndex]) {
            workOrder.jobs[jobIndex].status = status;

            // Update the work order with the modified jobs array
            await pb.collection("work_orders").update(workorderId, {
                jobs: workOrder.jobs,
            });

            console.log(`Job ${jobIndex} updated to status: ${status}`);
        } else {
            console.error(`Job at index ${jobIndex} not found.`);
        }
    } catch (error) {
        console.error("Error updating job status:", error);
        throw error;
    }
}

/**
 * Updates the timer display for a job.
 * @param {String} jobId - The ID of the job.
 */
function updateTimer(jobIndex, savedSeconds = 0) {
    const jobItem = document.querySelector(`li[data-job-id="${jobIndex}"]`);
    if (!jobItem) {
        console.error(`Job item with ID ${jobIndex} not found.`);
        return;
    }

    const timer = jobItem.querySelector(".job-timer");
    if (!timer) {
        console.error(`Timer element for job ID ${jobIndex} not found.`);
        return;
    }

    let time = parseInt(timer.getAttribute("data-time"), 10) || savedSeconds;

    // Increment and display the time
    time += 1;
    timer.textContent = formatTime(time);
    timer.setAttribute("data-time", time);
}

/**
 * Formats time in seconds to HH:MM:SS.
 * @param {Number} seconds - The time in seconds.
 * @returns {String} - The formatted time.
 */
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Event Listeners
backButton.addEventListener("click", () => {
    parent.showIframe(prevFrame);
    parent.window.scrollTo({ top: prevScrollPosition });
});

// Event listeners for modals
confirmStopButton.addEventListener("click", () => {
    console.log("Submit clicked");
    confirmStopButton.addEventListener("click", handleStopJob);
});

cancelStopButton.addEventListener("click", () => {
    stopJobModal.style.display = "none";
});

// Initial Fetch
fetchWorkOrderDetails();