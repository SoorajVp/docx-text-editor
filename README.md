# DOCX Text Editor

A simple web application for editing `.docx` files. Users can upload a document, edit its text content, and download the updated version. The application uses a React frontend and a Node.js + Express backend.

## Features
- Upload a `.docx` file URL.
- Unzip the document into editable `XML` format.
- Edit the document's text content.
- Save and upload the updated document to Cloudinary.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SoorajVp/docx-text-editor.git
   cd docx-text-editor
   ```

2. Install dependencies:
   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

## Running the Application

1. Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

2. Start the backend:
   ```bash
   cd server
   npm run dev
   ```

3. Open the app in your browser at `http://localhost:3000`.

## Usage
1. Enter the URL of a `.docx` file.
2. Edit the file text contents as needed.
3. Save the changes to upload the updated file to Cloudinary.

## Technologies Used
- React Vite (Frontend)
- Node.js + Express (Backend)
- Cloudinary API for file storage
