


# Mechanic Website

This repository contains a web application designed to streamline the process of creating, managing, and viewing vehicle repair work orders. The application supports three main user roles—**Admin**, **Mechanic**, and **Viewer**—each offering different permissions and capabilities. Below is an overview of the key features and a step-by-step guide to using the website.

---

## Table of Contents

## Table of Contents

1. [Contributions](#contributions)  
2. [Demo](#demo)  
3. [Key Features](#key-features)  
4. [User Roles](#user-roles)  
5. [How to Use](#how-to-use)  
   - [Admin Workflow](#admin-workflow)  
   - [Mechanic Workflow](#mechanic-workflow)  
   - [Viewer Workflow](#viewer-workflow)  
6. [PDF Export](#pdf-export)  
7. [Additional Notes](#additional-notes)  
8. [Project Setup Instructions](#project-setup-instructions)  
   - [Prerequisites](#prerequisites)  
   - [Setup Steps](#setup-steps)  
9. [How to Use the Program](#how-to-use-the-program)  
   - [Admin](#admin)  
     - [Order Page](#order-page)  
     - [Employee Management](#employee-management)  
       - [Employee Page](#employee-page)  
       - [Create Employee Page](#create-employee-page)  
     - [Creating Work Orders](#creating-work-orders)  
   - [Mechanic](#mechanic)  
     - [Order Page](#order-page-1)  


---

## Contributions

### Alex Friesen
- Built table with filters for displaying and searching for work orders
  - filter.js, table.js, workorders.js, employee_table.js
- Added download work order button
  - save_order.js
- Added user creation, modification and verification
   - create_user.js, edit_user.js, redirect.js

### David Lashko
- Added work order creation
- Added mechanic workorder interface
- Added work order details display
- Added code for switching iframes


### Lyn Ly
- Created all styling for the website
   - all html and css files




## Demo

[Mechanic Website Demo](https://afriesen731.github.io/mechanic_website/)

## Key Features

1. **Create Work Orders**  
   - Input detailed information about the vehicle or equipment (including reefer information, if applicable)  
   - Specify the type of service  
   - Add job descriptions (tasks) for mechanics to complete  

2. **Employee Management**  
   - Create new employees with specific roles (Admin, Mechanic, Viewer)  
   - Edit employee details (name, role, etc.)  
   - Easily assign or remove employees from work orders  

3. **Work Order Overview & Filtering**  
   - View all existing work orders  
   - Filter by status (e.g., *In Progress*), mechanic, date range, or service type  
   - Assign or unassign mechanics to tasks in a few clicks  

4. **Time Tracking & Task Completion**  
   - Mechanics can start, pause, or stop a timer while working on a specific task  
   - Automatically logs the duration of each task  

5. **Comments & Parts Used**  
   - Mechanics can add notes and list parts or materials used for each work order  
   - Finalizes the tasks upon completion  

6. **PDF Generation & Download**  
   - Generate PDF files with details of the work orders  
   - Print or save the PDFs to maintain a paper trail if required  

---

## User Roles

1. **Admin**  
   - Can create and manage work orders  
   - Can create and manage employees  
   - Has full access to all features  

2. **Mechanic**  
   - Can view work orders assigned to them  
   - Can start, pause, and complete tasks, tracking their work hours  
   - Can add notes and materials used  

3. **Viewer**  
   - Can view and download PDFs of work orders  
   - Useful for office staff who only need to review or print details  

---

## How to Use

### Admin Workflow

1. **Log In as Admin**  
   - Navigate to the login page and sign in with Admin credentials.

2. **Create a Work Order**  
   - Go to **Create Work Order**.  
   - Enter vehicle/equipment information, reefer details if applicable, and select service type.  
   - Add job descriptions (tasks) that need to be completed.  
   - Click **Submit** to create the work order.

3. **Create Employees**  
   - Go to **Create Employee**.  
   - Enter the name and select a role (Mechanic, Viewer, or Admin).  
   - Click **Create** to finalize employee creation.

4. **Manage Employees**  
   - Go to the **Employee** tab to view a list of all employees.  
   - **Edit** any employee’s name or role.  

5. **Manage Work Orders**  
   - Go to the **Order** tab.  
   - Filter work orders by status (In Progress, Completed, etc.), mechanic, date range, and service type.  
   - **Assign** mechanics to tasks or remove them as needed.  
   - Enter cost per hour if you want to track labor costs.

6. **View or Download Work Order Details**  
   - Click **View** on any work order to see details.  
   - Click **Download** to export the work order details as a PDF.

### Mechanic Workflow

1. **Log In as Mechanic**  
   - Use the credentials created by the Admin.

2. **View Assigned Work Orders**  
   - The **Orders** page automatically filters to show tasks assigned to the logged-in mechanic.  
   - You can also search for other work orders by service type or date range (if you need to join or leave tasks).

3. **Start, Pause, and Stop Tasks**  
   - Select a work order and click **Start** when you begin working.  
   - **Pause** if you need to stop temporarily.  
   - **Stop** when the task is completed. The system logs total time spent.

4. **Add Comments & Parts Used**  
   - After stopping the task, enter any relevant comments and list the parts or materials used.  
   - Submit to finalize the work order’s task completion.

### Viewer Workflow

1. **Log In as Viewer**  
   - Use the credentials created by the Admin for a Viewer role.

2. **View Work Orders**  
   - The **Orders** page shows all available work orders.  
   - Click **View** to see details of any particular order.

3. **Download Work Order Details (PDF)**  
   - Inside the view screen, click **Download** to get a PDF version of the work order.  
   - You can print this PDF for physical record-keeping.

---

## PDF Export

- The site provides a quick way to generate PDFs for each work order.  
- This is especially useful if you want to maintain both a digital and physical record of each job for billing or administrative purposes.  
- PDFs include all relevant details: vehicle info, tasks, assigned mechanics, total time spent, and any parts used.

---

## Additional Notes

- The system is designed to be user-friendly, with clear tabs and filtering options so you can quickly navigate between **Create Work Order**, **Create Employee**, **Orders**, and **Employees**.
- Admins have the highest level of control to set up the environment, manage user roles, and assign tasks.  
- Mechanics focus on completing tasks and tracking time.  
- Viewers typically handle paperwork, printing, or simple monitoring of active and completed work orders.

---



# Project Setup Instructions

This guide will help you set up the website on your local machine.

## Prerequisites

1. **Docker** - Ensure Docker is installed and running on your computer. [Download Docker](https://docs.docker.com/engine/install/)
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