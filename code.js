function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Job Tracker')
    .addItem('Search Job URL', 'searchJobURL')
    .addToUi();
}

function searchJobURL() {
  var ui = SpreadsheetApp.getUi();
  
  // Prompt the user to input the job URL
  var urlPrompt = ui.prompt('Enter Job URL:');
  var searchUrl = urlPrompt.getResponseText();

  if (!searchUrl) {
    ui.alert('Please enter a Job URL.');
    return;
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 4).getValues(); // Get all data starting from row 2, column 2 (Job URL)
  var jobExists = false;
  var jobRow = 0;

  // Check if the job URL exists
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === searchUrl) { // Column B contains the URL
      jobExists = true;
      jobRow = i + 2; // Adjust row number to match sheet rows
      break;
    }
  }

  if (jobExists) {
    // If job URL exists, show the data in an alert
    var jobTitle = sheet.getRange(jobRow, 1).getValue();
    var dateApplied = sheet.getRange(jobRow, 3).getValue();
    var status = sheet.getRange(jobRow, 4).getValue();
    var notes = sheet.getRange(jobRow, 5).getValue();

    ui.alert(
      'Job URL already exists!\n\n' +
      'Job Title: ' + jobTitle + '\n' +
      'Date Applied: ' + dateApplied + '\n' +
      'Status: ' + status + '\n' +
      'Notes: ' + notes
    );
  } else {
    // If URL does not exist, show a dialog to add new job details
    var response = ui.prompt('Enter Job Title and Notes (comma-separated)', ui.ButtonSet.OK);
    
    if (response.getSelectedButton() == ui.Button.OK) {
      var inputs = response.getResponseText().split(',');
      if (inputs.length < 2) {
        ui.alert('Please enter both fields: Job Title and Notes.');
        return;
      }
      
      var jobTitle = inputs[0].trim();
      var notes = inputs[1].trim();

      // Automatically set the status to "Applied"
      var status = "Applied";

      // Automatically set the date applied
      var dateApplied = new Date();

      // Append new job entry to the next available row
      var nextRow = sheet.getLastRow() + 1;
      sheet.getRange(nextRow, 1).setValue(jobTitle);  // Job Title
      sheet.getRange(nextRow, 2).setValue(searchUrl);  // Job URL
      sheet.getRange(nextRow, 3).setValue(dateApplied);  // Date Applied
      sheet.getRange(nextRow, 4).setValue(status);  // Status
      sheet.getRange(nextRow, 5).setValue(notes);  // Notes
      
      // Apply color formatting based on the status
      applyColorFormatting(sheet, nextRow, status);

      // Set a drop-down menu for status
      setStatusDropdown(sheet, nextRow);

      // Schedule a reminder email after 7 days
      scheduleReminderEmail(nextRow, dateApplied);

      ui.alert('New job entry added successfully!');
    }
  }
}

// Apply color formatting based on the status
function applyColorFormatting(sheet, row, status) {
  var range = sheet.getRange(row, 1, 1, 5);  // Get the entire row
  var color;
  
  switch (status) {
    case 'Applied':
      color = '#ADD8E6'; // Light blue for Applied
      break;
    case 'Follow-up':
      color = '#FFFF99'; // Yellow for Follow-up
      break;
    case 'Interviewing':
      color = '#90EE90'; // Light green for Interviewing
      break;
    case 'Rejected':
      color = '#FF6347'; // Light red for Rejected
      break;
  }
  
  range.setBackground(color);
}

// Add a drop-down list for the status column
function setStatusDropdown(sheet, row) {
  var statusRange = sheet.getRange(row, 4);  // Status column
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Applied', 'Follow-up', 'Interviewing', 'Rejected'])
    .build();
  statusRange.setDataValidation(rule);
}

// Automatically update color when status changes
function onEdit(e) {
  var range = e.range;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Check if the edited column is the Status column (column 4)
  if (range.getColumn() == 4 && range.getRow() > 1) {
    var status = range.getValue();
    var row = range.getRow();
    
    // Apply color formatting when the status changes
    applyColorFormatting(sheet, row, status);
  }
}

// Schedule a reminder email after 7 days
function scheduleReminderEmail(row, dateApplied) {
  var triggerDate = new Date(dateApplied);
  triggerDate.setDate(triggerDate.getDate() + 7);  // 7 days later

  // Set a trigger to run the reminderEmail function after 7 days
  ScriptApp.newTrigger('reminderEmail')
    .timeBased()
    .at(triggerDate)
    .create();
}



// Function to send reminder email after 7 days
function reminderEmail() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();  // Get all data starting from row 2
  
  for (var i = 0; i < data.length; i++) {
    var status = data[i][3];  // Column 4 is Status
    var jobTitle = data[i][0];  // Column 1 is Job Title
    var jobUrl = data[i][1];  // Column 2 is Job URL

    // If status is still "Applied", send a reminder email
    if (status === 'Applied') {
      MailApp.sendEmail({
        to: 'example@gmail.com', // Email address where the reminder will be sent
        subject: 'Reminder: Follow up on your job application',
        body: 'You applied for the job "' + jobTitle + '" at ' + jobUrl + ' 7 days ago. Consider following up if you haven’t already.'
      });
    }
  }
}
