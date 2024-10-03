# Job Application Tracker

This project is a Google Sheets-based application designed to help user manage their job applications effectively. It allows users to log job applications, track their status, and set reminders for follow-ups. The application is implemented using Google Apps Script to automate email reminders and manage data.

## Features

- **Add Job Applications**: Users can add job applications along with relevant details such as job title, URL, and notes.
- **Check for Duplicates**: When entering a job URL, the application checks if the job has already been applied for and displays existing data if it has.
- **Status Tracking**: Users can set the status of each application (e.g., Applied, Follow Up, Interviewing, Rejected), which visually reflects in the spreadsheet with color coding.
- **Automatic Reminders**: The application automatically sends an email reminder to follow up on job applications after 7 days.

## Installation

1. Open a new Google Sheet.
2. Go to **Extensions** > **Apps Script**.
3. Delete any existing code in the script editor and paste the code provided in this repository.
4. Save the script with a meaningful name.
5. Deploy the script as a web app through **Deploy** > **New deployment** and choose **Web app**.
6. Make sure to give permissions to the script to send emails.

## Usage

1. **Adding a Job Application**:
   - Input the job URL and click the "Search URL" button.
   - If the job has already been applied for, the existing data will be displayed.
   - If it's a new application, fill in the job title and notes, and submit the form.
   - The status will be set to "Applied" by default.

2. **Color Coding**:
   - The row color changes based on the application status:
     - **Applied**: Default color
     - **Follow Up**: Yellow
     - **Interviewing**: Green
     - **Rejected**: Red

3. **Reminders**:
   - The script will send a reminder email after 7 days (or 10 seconds during testing) if the application status remains "Applied."

## Development

This project was developed using Google Apps Script, which allows for custom scripts to enhance Google Sheets functionality. To make modifications, simply edit the script in the Apps Script editor.
