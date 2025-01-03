const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');  // For handling form data

const app = express();

// Log to a file using morgan
const logStream = fs.createWriteStream(path.join(__dirname, 'user_logs.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));


// Function to read the redirect URL from the file
const getRedirectUrl = () => {
  try {
    const url = fs.readFileSync('redirect_url.txt', 'utf8');
    return url.trim();
  } catch (error) {
    console.error('Error reading redirect URL:', error);
    return 'https://www.example.com'; // Default URL if file not found
  }
};

// Function to write the redirect URL to the file
const setRedirectUrl = (newUrl) => {
  try {
    fs.writeFileSync('redirect_url.txt', newUrl, 'utf8');
    console.log('Redirect URL updated to:', newUrl);
  } catch (error) {
    console.error('Error writing redirect URL:', error);
  }
};

// Function to clear the logs
const clearLogs = () => {
  try {
    fs.writeFileSync('user_logs.log', '');  // Clear the log file by overwriting it
    console.log('Logs cleared');
  } catch (error) {
    console.error('Error clearing logs:', error);
  }
};

// Home route (redirects to the second page)
app.get('/', (req, res) => {
  const userIp = req.ip;
  const userAgent = req.get('User-Agent');
  console.log(`User IP: ${userIp} | User Agent: ${userAgent}`);

  // Get the redirect URL from the file
  const redirectUrl = getRedirectUrl();

  // Redirect to the second page
  res.redirect('/second_page');
});

// Second page route (logging and redirect)
app.get('/second_page', (req, res) => {
  const userIp = req.ip;
  const userAgent = req.get('User-Agent');
  console.log(`User IP (Second Page): ${userIp} | User Agent: ${userAgent}`);

  // Get the redirect URL from the file
  const redirectUrl = getRedirectUrl();

  // Send the HTML with a JavaScript redirect after 3 seconds
  res.send(`
    <h1>Redirecting you to another page...</h1>
    <p>You will be redirected soon, or you can <a href="${redirectUrl}">click here</a>.</p>
    <script>
      setTimeout(function() {
        window.location.href = "${redirectUrl}";
      }, 3000);  // Redirect after 3 seconds
    </script>
  `);
});

// Route to Modify the Redirect URL (Admin only)
app.get('/modify-url', (req, res) => {
  // Get the current redirect URL
  const currentUrl = getRedirectUrl();

  // Serve the form to the admin
  res.send(`
    <h1>Modify Redirect URL</h1>
    <form action="/modify-url" method="POST">
      <label for="newUrl">New Redirect URL:</label>
      <input type="text" id="newUrl" name="newUrl" value="${currentUrl}" required />
      <button type="submit">Update URL</button>
    </form>
  `);
});

app.post('/modify-url', (req, res) => {
  // Get the new redirect URL from the form
  const newUrl = req.body.newUrl;

  if (newUrl) {
    // Update the redirect URL in the file
    setRedirectUrl(newUrl);

    res.send(`
      <h1>Redirect URL Updated</h1>
      <p>The redirect URL has been updated to: <a href="${newUrl}">${newUrl}</a></p>
      <p><a href="/">Go Back to Home</a></p>
    `);
  } else {
    res.send(`
      <h1>Error</h1>
      <p>Invalid URL. Please try again.</p>
      <p><a href="/modify-url">Go Back to Modify URL</a></p>
    `);
  }
});

// Route to View Logs (Admin only)
app.get('/view-logs', (req, res) => {
  fs.readFile('user_logs.log', 'utf8', (err, data) => {
    if (err) {
      res.send('<h1>Error</h1><p>Unable to read logs.</p>');
    } else {
      res.send(`
        <h1>View Logs</h1>
        <pre>${data}</pre>
        <p><a href="/">Go Back to Home</a></p>
      `);
    }
  });
});

// Route to Clear Logs (Admin only with token)
app.get('/clear-logs', (req, res) => {
  // Get the token from the query parameter
  
    clearLogs();
    res.send(`
      <h1>Logs Cleared</h1>
      <p>The logs have been successfully cleared.</p>
      <p><a href="/">Go Back to Home</a></p>
    `);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
