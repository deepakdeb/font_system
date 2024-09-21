# Font System

A web-based application that allows users to upload fonts, create font groups, and preview uploaded font styles.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [XAMPP](https://www.apachefriends.org/index.html) or another LAMP stack to run the backend.
- You have installed [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/).
- You have MySQL or MariaDB installed and running.

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/font-system.git
cd font-system
```

## 2. Backend Setup
### 2.1. Import the Database
Create a new MySQL database for the project using your preferred database management tool (e.g., phpMyAdmin, MySQL Workbench).
Import the font_system.sql file (located in the root directory of the project) to set up the necessary tables:

This will create the following tables:

fonts: Stores information about the uploaded fonts.

font_groups: Stores font groups.

font_group_fonts: Links fonts to font groups and stores font titles.

### 2.2. Configure Backend

Start your Apache server and make sure the backend is running.

## 3. Frontend Setup
### 3.1. Install Dependencies
```bash
npm install
```
### 3.2. Run the React Frontend
To start the development server:
```bash
npm start
```
The React app will open at http://localhost:3000/.

