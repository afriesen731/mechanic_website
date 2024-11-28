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

### 2. Inspect the Volume

You can inspect the volume to find its mount point on your system:

```sh
docker volume inspect pocketbase
```

This will output information similar to:

```json
[
    {
        "CreatedAt": "2024-11-28T10:07:16-06:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/pocketbase/_data",
        "Name": "pocketbase",
        "Options": null,
        "Scope": "local"
    }
]
```

Note the `Mountpoint` path (`/var/lib/docker/volumes/pocketbase/_data`), which we'll use in the next steps.

### 3. Set Permissions for the PocketBase Volume

Before running the PocketBase container, set the appropriate permissions on the volume's mount point to ensure that the container can read and write data correctly.

#### Steps:

1. **Change Permissions**: Set the directory permissions to `775`:

   ```sh
   sudo chmod -R 775 /var/lib/docker/volumes/pocketbase/_data
   ```

2. **Change Ownership**: Change the owner and group to `1001` (the default user ID in the PocketBase Docker image):

   ```sh
   sudo chown -R 1001:1001 /var/lib/docker/volumes/pocketbase/_data
   ```


### 4. Create a Docker Network

Create a Docker network named `pocketbase_network`:

```sh
docker network create pocketbase_network
```

### 5. Run PocketBase

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
- **Mounts** the Docker volume's data directory to the container's `/pocketbase` directory.

> **Important**: Ensure that the volume path in the `--volume` flag matches the `Mountpoint` from the `docker volume inspect pocketbase` command.

### 6. Clone the Repository

Clone the project repository from GitLab and navigate to the project directory:

```sh
git clone https://git.cs.usask.ca/dal165/cmpt370-team11.git
cd cmpt370-team11/cmpt370/
```

### 7. Install Dependencies

Install the required Node.js packages:

```sh
npm install
```

### 8. Update Environment Variables

Edit the `.env` file in the project root directory. Set the `VITE_DATABASE_URL` to point to your local PocketBase instance:

```env
VITE_DATABASE_URL="http://localhost:8090"
```

### 9. Run the Development Server

Start the development server:

```sh
npm run dev
```

The terminal will display a local URL (e.g., `http://localhost:5173`) where you can access the website.

### 10. Set Up PocketBase Admin Account

Open your browser and navigate to the PocketBase admin dashboard to set up your admin account:

1. **Access the Admin Dashboard**: Go to [http://localhost:8090/_](http://localhost:8090/_).
2. **Create an Admin Account**: Follow the prompts to create a new admin account.

### 11. Import Collections into PocketBase

After creating your admin account, you'll need to import the database schema into PocketBase:

1. **Go to Settings**: In the PocketBase admin dashboard, click on the **Settings** icon in the sidebar.
2. **Import Collections**: Select the **Import Collections** section.
3. **Load from JSON File**: Click on the **Load from JSON File** button.
4. **Select `pb_schema.json`**:
   - Navigate to the project directory where the `pb_schema.json` file is located.
   - Select the `pb_schema.json` file.
5. **Choose Import Options**:
   - In the import dialog, select **Merge** to combine the imported collections with any existing ones.
6. **Confirm Import**: Click on **Import** to apply the schema.

### 12. Add an Admin User

Now, add a new user with admin privileges:

1. **Navigate to Users**: In the PocketBase admin dashboard, click on **Users** in the sidebar.
2. **Add New User**: Click on the **+ New User** button.
3. **Fill in User Details**: Provide the necessary details for the new user, such as email and password.
4. **Assign Admin Role**: Set the user's role to **Admin**.
5. **Save User**: Click **Create** to save the new admin user.

### 13. Access the Website

Open your browser and go to the URL displayed by the npm development server (e.g., [http://localhost:5173](http://localhost:5173)) to use the website.