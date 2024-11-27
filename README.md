# Project Setup Instructions

This guide will help you set up the website on your local machine.

## Prerequisites

1. **Docker** - Ensure Docker is installed and running on your computer. [Download Docker](https://www.docker.com/products/docker-desktop)
2. **Node.js** - Install Node.js, which includes npm. [Download Node.js](https://nodejs.org/en/download/)

## Setup Steps

### 1. Create a Docker Volume for PocketBase

Open your terminal and run the following command to create a Docker volume named `pocketbase`:

```sh
docker volume create pocketbase
```

### 2. Create a Docker Network

Create a Docker network named `pocketbase_network`:

```sh
docker network create pocketbase_network
```

### 3. Run PocketBase

Run the PocketBase Docker container with the following command:

```sh
docker run -d --name pocketbase_ -p 8090:8090 \
  --env USER_DEFINED_KEY=custom_value \
  --network pocketbase_network \
  --volume /var/lib/docker/volumes/pocketbase/_data:/pocketbase \
  adrianmusante/pocketbase:latest
```

This command does the following:

- **Runs** the PocketBase container in detached mode (`-d`).
- **Names** the container `pocketbase_`.
- **Maps** port `8090` of the container to port `8090` on your local machine (`-p 8090:8090`).
- **Sets** an environment variable `USER_DEFINED_KEY` to `custom_value`.
- **Connects** the container to the `pocketbase_network`.
- **Mounts** the Docker volume `pocketbase` to the container's `/pocketbase` directory.

### 4. Clone the Repository

Clone the project repository from GitLab and navigate to the project directory:

```sh
git clone https://git.cs.usask.ca/dal165/cmpt370-team11.git
cd cmpt370-team11/cmpt370/
```

### 5. Install Dependencies

Install the required Node.js packages:

```sh
npm install
```

### 6. Update Environment Variables

Edit the `.env` file in the project root directory. Set the `VITE_DATABASE_URL` to point to your local PocketBase instance:

```env
VITE_DATABASE_URL=http://localhost:8090
```

### 7. Run the Development Server

Start the development server:

```sh
npm run dev
```

The terminal will display a local URL (e.g., `http://localhost:5173`) where you can access the website.

### 8. Set Up PocketBase Admin Account

Open your browser and navigate to the PocketBase admin dashboard to set up your admin account:

1. **Access the Admin Dashboard**: Go to [http://localhost:8090/_](http://localhost:8090/_).
2. **Create an Admin Account**: Follow the prompts to create a new admin account.
3. **Add an Admin User**:
   - After logging in, navigate to the **Users** section.
   - Add a new user and assign them the role of **Admin**.
4. **Log In with New Admin User**: Use the credentials of the newly created admin user to log in to the dashboard.

### 9. Access the Website

Open your browser and go to the URL displayed by the development server (e.g., [http://localhost:5173](http://localhost:5173)) to use the website.

---

**Note**: Ensure that both the PocketBase server and the development server are running simultaneously. If you encounter any issues, check the terminal outputs for error messages and verify that all steps were followed correctly.