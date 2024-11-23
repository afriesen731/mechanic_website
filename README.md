# Project Setup Instructions

This guide will help you set up the website on your local machine.

## Prerequisites

1. **Docker** - Make sure Docker is installed and running on your computer. [Download Docker](https://www.docker.com/products/docker-desktop)
2. **Node.js** - Install Node.js, which will also install npm. [Download Node.js](https://nodejs.org/en/download/)

## Setup Steps

1. **Run PocketBase using Docker Compose**

   Download the `docker-compose.yml` file from [this link](https://github.com/adrianmusante/docker-pocketbase/blob/main/docker-compose.yml) and save it in your project directory.

   Then, open your terminal and run the following command to start PocketBase:

   ```sh
   docker-compose up -d
   ```

   This will start PocketBase on port 8090.

2. **Clone the Repository**

   Clone the project repository from GitLab:

   ```sh
   git clone https://git.cs.usask.ca/dal165/cmpt370-team11.git
   cd cmpt370
   ```

3. **Install Dependencies**

   Make sure you have Node.js installed, then run the following command to install the required packages:

   ```sh
   npm install
   ```

4. **Update Environment Variables**

   Edit the `.env` file in the project root. Replace the `VITE_DATABASE_URL` with the URL of the running PocketBase instance:

   ```env
   VITE_DATABASE_URL=http://localhost:8090
   ```

5. **Run the Development Server**

   Start the development server:

   ```sh
   npm run dev
   ```

   The terminal will display a local URL (e.g., `http://localhost:3000`) where you can access the website.

6. **Access the Website**

   Open your browser and go to the URL displayed by the terminal to use the website.

