function fetchAndSummarizeInbox() {
  var today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // 24 hours ago

  var threads = GmailApp.search("after:" + Utilities.formatDate(yesterday, "GMT", "yyyy/MM/dd") + " before:" + Utilities.formatDate(today, "GMT", "yyyy/MM/dd"));
  var emailSummary = "";

  threads.forEach(thread => {
    var messages = thread.getMessages();
    messages.forEach(message => {
      var sender = message.getFrom();
      var date = message.getDate();

      if (date > yesterday && date <= today) { // Emails from the past 24 hours
        var subject = message.getSubject();
        var body = message.getPlainBody();
        
        emailSummary += "Subject: " + subject + "\n";
        emailSummary += "From: " + sender + "\n";
        emailSummary += "Body: " + body + "\n\n";
      }
    });
  });

  return emailSummary;
}

function composeAndSendSummary() {
  var emailSummary = fetchAndSummarizeInbox();

  if (emailSummary.length > 0) {
    var recipient = "urmailid"; // Replace with the user's email address

    GmailApp.sendEmail(recipient, "Daily Email Summary", emailSummary);

    Logger.log("Email sent to: " + recipient);
  } else {
    Logger.log("No new emails to summarize");
  }
}
