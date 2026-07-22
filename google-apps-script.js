const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const EMPLOYEES_SHEET_NAME = 'Employees';
const LOGS_SHEET_NAME = 'Logs';
const REPORTS_SHEET_NAME = 'Reports';
const PAYROLL_SHEET_NAME = 'Payroll';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss.getSheetByName(EMPLOYEES_SHEET_NAME)) {
    const sheet = ss.insertSheet(EMPLOYEES_SHEET_NAME);
    sheet.appendRow(['Name', 'Mobile', 'Password']);
    sheet.getRange("A1:C1").setFontWeight("bold").setBackground("#f3f4f6");
  }

  if (!ss.getSheetByName(LOGS_SHEET_NAME)) {
    const sheet = ss.insertSheet(LOGS_SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Mobile', 'Name', 'Action']);
    sheet.getRange("A1:D1").setFontWeight("bold").setBackground("#f3f4f6");
  }

  // If old Dashboard exists, you might want to delete it manually.
  setupReportsSheet();
  setupPayrollSheet();
}

function createMonthYearSelectors(sheet) {
  sheet.getRange("B5").setValue("Month:").setFontWeight("bold").setHorizontalAlignment("right");
  sheet.getRange("D5").setValue("Year:").setFontWeight("bold").setHorizontalAlignment("right");

  const monthCell = sheet.getRange("C5");
  const yearCell = sheet.getRange("E5");

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthRule = SpreadsheetApp.newDataValidation().requireValueInList(months, true).build();
  monthCell.setDataValidation(monthRule).setBackground("#f8fafc").setBorder(true, true, true, true, false, false);
  monthCell.setValue(months[new Date().getMonth()]);

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(String);
  const yearRule = SpreadsheetApp.newDataValidation().requireValueInList(years, true).build();
  yearCell.setDataValidation(yearRule).setBackground("#f8fafc").setBorder(true, true, true, true, false, false);
  yearCell.setValue(currentYear.toString());
}

function setupReportsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(REPORTS_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(REPORTS_SHEET_NAME, 0);
  } else {
    sheet.clear();
  }

  sheet.setHiddenGridlines(true);
  sheet.getRange("A1:Z100").setBackground("#ffffff");

  sheet.getRange("B2:E3").setBackground("#0f172a").setFontColor("#f59e0b").merge();
  const header = sheet.getRange("B2");
  header.setValue("ATTENDANCE REPORTS").setFontSize(16).setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");

  createMonthYearSelectors(sheet);

  sheet.getRange("B6").setValue("Employee:").setFontWeight("bold").setHorizontalAlignment("right");
  const empCell = sheet.getRange("C6:E6").merge();
  sheet.getRange("Z1").setFormula('={"All"; FILTER(Employees!A2:A, Employees!A2:A<>"")}');
  const empRule = SpreadsheetApp.newDataValidation().requireValueInRange(sheet.getRange("Z1:Z100"), true).build();
  empCell.setDataValidation(empRule).setBackground("#f8fafc").setBorder(true, true, true, true, false, false);
  empCell.setValue("All");

  sheet.getRange("B7:E7").setBackground("#1e293b").setFontColor("#ffffff").merge();
  sheet.getRange("B7").setValue("MONTHLY ATTENDANCE SUMMARY").setFontWeight("bold").setHorizontalAlignment("center");

  sheet.getRange("B8:E8").setBackground("#f1f5f9").setFontWeight("bold").setBorder(true, true, true, true, false, false);
  sheet.getRange("C8:D8").setHorizontalAlignment("center");
  
  sheet.getRange("B8").setFormula("=DYNAMIC_REPORT(C6, C5, E5, Logs!A2:A, Employees!A2:A)");

  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 140);
  sheet.setColumnWidth(4, 140);
  sheet.setColumnWidth(5, 120);
}

function setupPayrollSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(PAYROLL_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(PAYROLL_SHEET_NAME, 1);
  } else {
    sheet.clear();
  }

  sheet.setHiddenGridlines(true);
  sheet.getRange("A1:Z100").setBackground("#ffffff");

  sheet.getRange("B2:E3").setBackground("#0f172a").setFontColor("#10b981").merge();
  const header = sheet.getRange("B2");
  header.setValue("PAYROLL CALCULATOR").setFontSize(16).setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");

  createMonthYearSelectors(sheet);

  sheet.getRange("B8").setValue("Select Employee:").setFontWeight("bold").setHorizontalAlignment("right");
  sheet.getRange("B9").setValue("Rate Type:").setFontWeight("bold").setHorizontalAlignment("right");
  sheet.getRange("B10").setValue("Rate Amount (₹):").setFontWeight("bold").setHorizontalAlignment("right");

  const empCell = sheet.getRange("C8:D8").merge();
  const rateTypeCell = sheet.getRange("C9:D9").merge();
  const rateAmountCell = sheet.getRange("C10:D10").merge();

  const empRule = SpreadsheetApp.newDataValidation().requireValueInRange(ss.getRange(`'${EMPLOYEES_SHEET_NAME}'!A2:A`), true).build();
  empCell.setDataValidation(empRule).setBackground("#f8fafc").setBorder(true, true, true, true, false, false);

  const rateTypes = ["Hourly", "Daily"];
  const rateTypeRule = SpreadsheetApp.newDataValidation().requireValueInList(rateTypes, true).build();
  rateTypeCell.setDataValidation(rateTypeRule).setBackground("#f8fafc").setBorder(true, true, true, true, false, false);
  rateTypeCell.setValue("Daily");

  rateAmountCell.setBackground("#f8fafc").setBorder(true, true, true, true, false, false).setValue(500);

  sheet.getRange("B12").setValue("Total Days Present:").setFontWeight("bold").setHorizontalAlignment("right");
  sheet.getRange("B13").setValue("Total Hours Worked:").setFontWeight("bold").setHorizontalAlignment("right");
  sheet.getRange("B15").setValue("TOTAL PAYROLL:").setFontWeight("bold").setHorizontalAlignment("right").setFontSize(12);

  const daysCell = sheet.getRange("C12:D12").merge();
  const hoursCell = sheet.getRange("C13:D13").merge();
  const totalCell = sheet.getRange("C15:D15").merge();

  daysCell.setFormula("=IF(ISBLANK(C8), 0, GET_TOTAL_DAYS(C8, C5, E5))").setBackground("#f0fdf4").setFontWeight("bold");
  hoursCell.setFormula("=IF(ISBLANK(C8), 0, GET_TOTAL_HOURS(C8, C5, E5))").setBackground("#f0fdf4").setFontWeight("bold");

  totalCell.setFormula('=IF(C9="Daily", C12*C10, C13*C10)').setBackground("#ecfdf5").setFontColor("#10b981").setFontSize(14).setFontWeight("bold");

  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 140);
  sheet.setColumnWidth(4, 140);
  sheet.setColumnWidth(5, 120);
}

// ---------------------------------------------------------
// CUSTOM FUNCTIONS FOR GOOGLE SHEETS
// ---------------------------------------------------------

/**
 * Custom function to generate a dynamic report
 * @customfunction
 */
function DYNAMIC_REPORT(empName, monthName, year, logsDummy, empDummy) {
  if (empName === "All" || !empName) {
    const data = GET_ALL_EMPLOYEES_REPORT(monthName, year);
    return [
      ["Employee Name", "Days Present", "Hours Worked", ""],
      ...data
    ];
  } else {
    const data = GET_SINGLE_EMPLOYEE_REPORT(empName, monthName, year);
    return [
      ["Date", "Clock In", "Clock Out", "Hours Worked"],
      ...data
    ];
  }
}

/**
 * Custom function to generate a report of all employees
 * @customfunction
 */
function GET_ALL_EMPLOYEES_REPORT(monthName, year) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const empSheet = ss.getSheetByName(EMPLOYEES_SHEET_NAME);
  if (!empSheet) return [["No data", "", ""]];

  const empData = empSheet.getDataRange().getValues();
  empData.shift();

  if (empData.length === 0) return [["No employees found", "", ""]];

  let report = [];

  empData.forEach(row => {
    const name = row[0];
    if (name) {
      const days = GET_TOTAL_DAYS(name, monthName, year);
      const hours = GET_TOTAL_HOURS(name, monthName, year);
      report.push([name, days, hours, ""]);
    }
  });

  if (report.length === 0) return [["No employees found", "", "", ""]];
  return report;
}

/**
 * Custom function to generate a detailed report for a single employee
 * @customfunction
 */
function GET_SINGLE_EMPLOYEE_REPORT(empName, monthName, year) {
  const data = getFilteredLogs(empName, monthName, year);
  data.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  
  let report = [];
  let inTime = null;
  let lastDateStr = null;
  const timeZone = Session.getScriptTimeZone();
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const timestamp = new Date(row[0]);
    const action = row[3]; 
    
    if (action === 'In') {
      inTime = timestamp;
    } else if (action === 'Out' && inTime) {
      const hours = Math.round(((timestamp - inTime) / (1000 * 60 * 60)) * 100) / 100;
      const dateStr = Utilities.formatDate(inTime, timeZone, "yyyy-MM-dd");
      const displayDate = (dateStr === lastDateStr) ? "" : dateStr;
      
      const inStr = Utilities.formatDate(inTime, timeZone, "hh:mm a");
      const outStr = Utilities.formatDate(timestamp, timeZone, "hh:mm a");
      report.push([displayDate, inStr, outStr, hours]);
      inTime = null;
      lastDateStr = dateStr;
    }
  }
  
  if (inTime) {
      const dateStr = Utilities.formatDate(inTime, timeZone, "yyyy-MM-dd");
      const displayDate = (dateStr === lastDateStr) ? "" : dateStr;
      const inStr = Utilities.formatDate(inTime, timeZone, "hh:mm a");
      report.push([displayDate, inStr, "Working...", ""]);
  }

  if (report.length === 0) return [["No records found", "", "", ""]];
  return report;
}

/**
 * Custom function to calculate total days present for an employee in a given month/year.
 * @customfunction
 */
function GET_TOTAL_DAYS(empName, monthName, year) {
  const data = getFilteredLogs(empName, monthName, year);
  const uniqueDays = new Set();

  data.forEach(row => {
    const date = new Date(row[0]);
    const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    uniqueDays.add(dateString);
  });

  return uniqueDays.size;
}

/**
 * Custom function to calculate total hours worked for an employee in a given month/year.
 * @customfunction
 */
function GET_TOTAL_HOURS(empName, monthName, year) {
  const data = getFilteredLogs(empName, monthName, year);
  data.sort((a, b) => new Date(a[0]) - new Date(b[0]));

  let totalMilliseconds = 0;
  let lastInTime = null;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const timestamp = new Date(row[0]);
    const action = row[3];

    if (action === 'In') {
      lastInTime = timestamp;
    } else if (action === 'Out' && lastInTime) {
      totalMilliseconds += (timestamp - lastInTime);
      lastInTime = null;
    }
  }

  return Math.round((totalMilliseconds / (1000 * 60 * 60)) * 100) / 100;
}

function getFilteredLogs(empName, monthName, year) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(LOGS_SHEET_NAME);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  data.shift();

  const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName);

  return data.filter(row => {
    if (!row[0]) return false;
    const date = new Date(row[0]);
    const rowEmpName = String(row[2]).trim();

    return rowEmpName === String(empName).trim() &&
      date.getMonth() === monthIndex &&
      date.getFullYear() === parseInt(year);
  });
}

// ---------------------------------------------------------
// WEB APP API FUNCTIONS 
// ---------------------------------------------------------

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT).setHeaders(getCorsHeaders());
}

function doPost(e) {
  let response = { success: false, message: 'Invalid Request' };
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    if (action === 'login') {
      response = handleLogin(postData.mobile, postData.password);
    } else if (action === 'logAttendance') {
      response = handleAttendance(postData.mobile, postData.attendanceAction);
    } else if (action === 'getStatus') {
      response = handleGetStatus(postData.mobile);
    } else if (action === 'updateProfile') {
      response = handleUpdateProfile(postData.oldMobile, postData.password, postData.newMobile, postData.newPassword);
    }
  } catch (err) {
    response.message = 'Error parsing request: ' + err.toString();
  }
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("PAYYAVOOR FUELS Attendance API is running.").setMimeType(ContentService.MimeType.TEXT);
}

function handleLogin(mobile, password) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(EMPLOYEES_SHEET_NAME);
  if (!sheet) return { success: false, message: 'Employees sheet not found' };

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const rowMobile = String(data[i][1]).trim();
    const rowPassword = String(data[i][2]).trim();

    if (rowMobile === String(mobile).trim() && rowPassword === String(password).trim()) {
      return { success: true, message: 'Login successful', user: { name: data[i][0], mobile: rowMobile } };
    }
  }
  return { success: false, message: 'Invalid mobile number or password' };
}

function handleUpdateProfile(oldMobile, currentPassword, newMobile, newPassword) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(EMPLOYEES_SHEET_NAME);
  if (!sheet) return { success: false, message: 'Employees sheet not found' };

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const rowMobile = String(data[i][1]).trim();
    const rowPassword = String(data[i][2]).trim();

    if (rowMobile === String(oldMobile).trim() && rowPassword === String(currentPassword).trim()) {
      sheet.getRange(i + 1, 2).setValue(newMobile); // Update mobile
      sheet.getRange(i + 1, 3).setValue(newPassword); // Update password
      return { success: true, message: 'Profile updated successfully', user: { name: data[i][0], mobile: newMobile } };
    }
  }
  return { success: false, message: 'Invalid current password' };
}

function handleGetStatus(mobile) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logsSheet = ss.getSheetByName(LOGS_SHEET_NAME);
  if (!logsSheet) return { success: false, message: 'Logs sheet not found' };

  const logsData = logsSheet.getDataRange().getValues();
  let lastAction = 'Out';
  let recentLogs = [];

  for (let i = logsData.length - 1; i >= 1; i--) {
    if (String(logsData[i][1]).trim() === String(mobile).trim()) {
      if (recentLogs.length === 0) {
        lastAction = logsData[i][3];
      }
      if (recentLogs.length < 10) {
        recentLogs.push({
          timestamp: logsData[i][0],
          action: logsData[i][3]
        });
      }
    }
  }
  return { success: true, lastAction: lastAction, recentLogs: recentLogs };
}

function handleAttendance(mobile, explicitAction) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const empSheet = ss.getSheetByName(EMPLOYEES_SHEET_NAME);
  const logsSheet = ss.getSheetByName(LOGS_SHEET_NAME);
  if (!empSheet || !logsSheet) return { success: false, message: 'Required sheets not found' };

  const empData = empSheet.getDataRange().getValues();
  let empName = '';
  for (let i = 1; i < empData.length; i++) {
    if (String(empData[i][1]).trim() === String(mobile).trim()) {
      empName = empData[i][0];
      break;
    }
  }

  if (!empName) return { success: false, message: 'Employee not found' };

  let newAction = explicitAction;
  if (explicitAction === 'Auto') {
    const statusResult = handleGetStatus(mobile);
    newAction = statusResult.lastAction === 'In' ? 'Out' : 'In';
  }

  const timestamp = new Date().toISOString();
  logsSheet.appendRow([timestamp, mobile, empName, newAction]);

  return { success: true, message: 'Attendance logged successfully', action: newAction, timestamp: timestamp };
}
