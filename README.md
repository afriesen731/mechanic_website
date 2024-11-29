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

### 9. Import Collections into PocketBase

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

### 10. Add an Admin User

Now, add a new user with admin privileges:

1. **Navigate to Users**: In the PocketBase admin dashboard, click on **Users** in the sidebar.
2. **Add New User**: Click on the **+ New User** button.
3. **Fill in User Details**: Provide the necessary details for the new user, such as email and password.
4. **Assign Admin Role**: Set the user's role to **Admin**.
5. **Save User**: Click **Create** to save the new admin user.

### 11. Access the Website

Open your browser and go to the URL displayed by the npm development server (e.g., [http://localhost:5173](http://localhost:5173)) to use the website.


----

# How to Use the Program

This guide provides step-by-step instructions on how to use the program for both **Admin** and **Mechanic** roles. The program is designed to manage work orders efficiently, allowing users to create, assign, and track orders with ease.

--

## Admin

### Order Page

- **Viewing Orders**:
  - Access the **Orders** table to view all work orders.
  - The table displays comprehensive information about each work order.

- **Filtering Orders**:
  - Use any combination of filter values to refine the list of displayed orders.
  - By default, only orders that are **In Progress** are shown.

- **Assigning Mechanics to Orders**:
  - In the **Actions** column, use the **Select Mechanic** field to search for mechanics.
  - Select a mechanic to assign to the order.
  - Click the **Assign** button to assign the selected mechanic.

- **Managing Assigned Mechanics**:
  - In the **Mechanics** column, view the list of mechanics assigned to each order.
  - Click the **X** button next to a mechanic's name to unassign them from the work order.

- **Viewing and Editing Orders**:
  - Click the **View** button in the **Actions** column to access detailed information about a work order.
    - Modify the form fields as needed.
    - Click **Submit** to save changes.
    - Click the **Download** button to download a PDF of the work order.
    - Click the **Back** button to return to the orders table.

### Employee Management

#### Employee Page

- **Searching for Employees**:
  - Enter the employee's name in the search bar.
  - Click the **Search** button to locate the employee.

- **Editing Employee Information**:
  - In the **Actions** column of the employee table, click **Edit**.
  - Modify the employee's data in the edit form.
    - **Note**: Leave the **Password** field empty if you do not wish to change it.
  - Click **Submit** to update the employee's information.

#### Create Employee Page

- **Creating a New Employee**:
  - Fill in the required form fields with the new employee's information.
  - Click the **Done** button to create the employee profile.

### Creating Work Orders

- **Create Work Order Page**:
  - Fill in the relevant fields for the new work order.
  - Click the **Submit Work Order** button to create the work order.

---

## Mechanic

### Order Page

- **Viewing Orders**:
  - Access the **Orders** table to view work orders assigned to you.
  - The table displays key information about each work order.

- **Filtering Orders**:
  - Use any combination of filter values to refine the list of displayed orders.
  - By default, only orders assigned to you are shown.

- **Joining or Leaving Orders**:
  - In the **Actions** column, click the **Join** button to assign yourself to an order.
  - Click the **Leave** button to unassign yourself from an order.

- **Viewing and Editing Orders**:
  - Click the **View** button in the **Actions** column to access detailed information about a work order.
    - Modify the form fields as necessary.
    - Click **Submit** to save changes.
    - Click the **Download** button to download a PDF of the work order.
    - Click the **Back** button to return to the orders table.