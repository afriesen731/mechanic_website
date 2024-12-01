import { pb } from "../js/import_pb.js";

const workorderId = new URLSearchParams(window.location.search).get("order");
const prevFrame = new URLSearchParams(window.location.search).get("prevFrame");
const prevScrollPosition = new URLSearchParams(window.location.search).get("prevScroll");

const backButton = document.getElementById("back-button");
const jobList = document.getElementById("job-list");
const workorderInfo = document.getElementById("workorder-info");
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
        const workOrder = await pb.collection("work_orders").getOne(workorderId, {
            expand: "jobs",
        });

        document.getElementById("workorder-id").textContent = workOrder.id;
        document.getElementById("workorder-status").textContent = workOrder.status;

        displayJobs(workOrder.jobs);
    } catch (error) {
        console.error("Error fetching work order details:", error);
        alert("Failed to fetch work order details. Please try again.");
    }
}

/**
 * Displays the list of jobs for the work order.
 * @param {Array} jobs - List of jobs associated with the work order.
 */
function displayJobs(jobs) {
    jobList.innerHTML = ""; // Clear existing jobs

    jobs.forEach((job) => {
        const jobItem = document.createElement("li");
        jobItem.className = "job-item";
        jobItem.dataset.jobId = job.id;

        const jobTitle = document.createElement("div");
        jobTitle.textContent = `${job.title} (Status: ${job.status})`;
        jobItem.appendChild(jobTitle);

        const timer = document.createElement("span");
        timer.className = "job-timer";
        timer.textContent = formatTime(job.timeSpent || 0);
        jobItem.appendChild(timer);

        const actions = createJobActions(job);
        jobItem.appendChild(actions);

        jobList.appendChild(jobItem);
    });
}

/**
 * Creates action buttons for a job.
 * @param {Object} job - The job object.
 * @returns {HTMLElement} - A container with action buttons.
 */
function createJobActions(job) {
    const actionContainer = document.createElement("div");
    actionContainer.className = "job-actions";

    if (job.status === "Pending" || job.status === "Paused") {
        const startButton = document.createElement("button");
        startButton.textContent = "Start";
        startButton.onclick = () => startJob(job.id);
        actionContainer.appendChild(startButton);
    }

    if (job.status === "In Progress") {
        const pauseButton = document.createElement("button");
        pauseButton.textContent = "Pause";
        pauseButton.onclick = () => pauseJob(job.id);
        actionContainer.appendChild(pauseButton);

        const stopButton = document.createElement("button");
        stopButton.textContent = "Stop";
        stopButton.onclick = () => showStopJobModal(job.id);
        actionContainer.appendChild(stopButton);
    }

    if (job.status === "Paused") {
        const resumeButton = document.createElement("button");
        resumeButton.textContent = "Resume";
        resumeButton.onclick = () => resumeJob(job.id);
        actionContainer.appendChild(resumeButton);
    }

    return actionContainer;
}

/**
 * Starts a job and begins its timer.
 * @param {String} jobId - The ID of the job to start.
 */
async function startJob(jobId) {
    try {
        await updateJobStatus(jobId, "In Progress");
        activeTimers[jobId] = setInterval(() => updateTimer(jobId), 1000);
        fetchWorkOrderDetails();
    } catch (error) {
        console.error("Error starting job:", error);
        alert("Failed to start the job. Please try again.");
    }
}

/**
 * Pauses a job and stops its timer.
 * @param {String} jobId - The ID of the job to pause.
 */
async function pauseJob(jobId) {
    try {
        await updateJobStatus(jobId, "Paused");
        clearInterval(activeTimers[jobId]);
        delete activeTimers[jobId];
        fetchWorkOrderDetails();
    } catch (error) {
        console.error("Error pausing job:", error);
        alert("Failed to pause the job. Please try again.");
    }
}

/**
 * Resumes a paused job and restarts its timer.
 * @param {String} jobId - The ID of the job to resume.
 */
async function resumeJob(jobId) {
    try {
        await updateJobStatus(jobId, "In Progress");
        activeTimers[jobId] = setInterval(() => updateTimer(jobId), 1000);
        fetchWorkOrderDetails();
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
        const payload = {
            status: "Completed",
            comment,
            partsUsed,
        };

        await pb.collection("jobs").update(selectedJobId, payload);
        clearInterval(activeTimers[selectedJobId]);
        delete activeTimers[selectedJobId];
        stopJobModal.style.display = "none";
        fetchWorkOrderDetails();
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
 * Updates a job's status.
 * @param {String} jobId - The ID of the job to update.
 * @param {String} status - The new status of the job.
 */
async function updateJobStatus(jobId, status) {
    await pb.collection("jobs").update(jobId, { status });
}

/**
 * Updates the timer display for a job.
 * @param {String} jobId - The ID of the job.
 */
function updateTimer(jobId) {
    const jobItem = document.querySelector(`li[data-job-id="${jobId}"]`);
    const timer = jobItem.querySelector(".job-timer");

    const time = parseInt(timer.getAttribute("data-time"), 10) || 0;
    timer.textContent = formatTime(time + 1);
    timer.setAttribute("data-time", time + 1);
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
    // Add logic for stopping a job here
});

cancelStopButton.addEventListener("click", () => {
    stopJobModal.style.display = "none";
});

// Initial Fetch
fetchWorkOrderDetails();