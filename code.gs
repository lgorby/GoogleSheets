//Working Script but unable to get sidebar buttons and refresh them when clicked:

function openSidebar() {
  var ui = SpreadsheetApp.getUi();
  var currentMonth = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Charts").getRange("H1").getValue();
  var mainSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Main");
  
  // Filter and retrieve forecasted bills for the current month
  var dataForCurrentMonth = mainSheet.getDataRange().getValues().filter(function(row) {
    return Utilities.formatDate(new Date(row[5]), Session.getScriptTimeZone(), "MMMM") === currentMonth;
  });

  // Remove entries with specific categories
  dataForCurrentMonth = dataForCurrentMonth.filter(function(row) {
    var billName = row[0];
    return !(billName.includes("Miscellaneous - Lonnie") || billName.includes("Miscellaneous - Kevin") || billName.includes("Miscellaneous - Shared"));
  });

  // Sort data by Amount due in descending order
  dataForCurrentMonth.sort(function(a, b) {
    return b[3] - a[3];
  });

  // Calculate total amount for the current month
  var totalAmount = dataForCurrentMonth.reduce(function(acc, row) {
    return acc + row[3];
  }, 0);

  // Create HTML content for the sidebar
  var htmlContent = '<div class="container">';
  htmlContent += '<div class="total">Total Forecasted Amount: <span class="amount">$' + totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span></div>';
  htmlContent += '<hr>'; // Separator line

  // Generate HTML for each filtered bill
  dataForCurrentMonth.forEach(function(row) {
    var formattedAmount = row[3].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    htmlContent += '<div class="item">';
    htmlContent += '  <div><b>Bill Name: ' + row[0] + '</b></div>';
    htmlContent += '  <div>Category: ' + row[4] + '</div>';
    htmlContent += '  <div>Amount: <span class="amount">$' + formattedAmount + '</span></div>';
    htmlContent += '  <div>Date: ' + Utilities.formatDate(new Date(row[5]), Session.getScriptTimeZone(), "MM/dd/yyyy") + '</div>';
    htmlContent += '  <div>Responsible: ' + row[2] + '</div>';
    htmlContent += '</div>';
    htmlContent += '<hr>'; // Separator line
  });

  htmlContent += '</div>';

  // Create a sidebar and set its content
  var sidebar = HtmlService.createHtmlOutput(htmlContent)
    .setTitle('Forecasted Bills for ' + currentMonth)
    .setWidth(400);
  
  ui.showSidebar(sidebar);
}
