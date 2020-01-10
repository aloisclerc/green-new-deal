const express = require("express");
const app = express();
const fs = require('fs');
const readline = require('readline');
let eventList = [];
let eventDate = [];
let eventTime = [];
let eventLocation = [];



const {
  google
} = require('googleapis');
const request = require("request");

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() - 300 * 60 * 1000);
  console.log("New Date: " + newDate);
  var offset = 300 / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({
    version: 'v3',
    auth
  });
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    let a = [];
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        let start = event.start.dateTime;
        console.log(event.start.dateTime)

        let end = event.end.dateTime;
        let location = event.location;
        const summary = event.summary;
        eventList.push(`${event.summary}`);
        // eventDate.push(`${date}`);
        var date = convertUTCDateToLocalDate(new Date(start));

        // var date = new Date(Date.parse(start));
        // date = convertUTCDateToLocalDate(date);
        console.log("Date: " + date.toDateString() + "Hours: " + date.getHours())
        var dateEnd = new Date(Date.parse(end));

        dateEnd = convertUTCDateToLocalDate(dateEnd);
        if (date.getHours > 18) {
          eventDate.push(new Date(Date.parse(date)-86400000).toDateString);

        } else {
          eventDate.push(date.toDateString);
        }
        eventLocation.push(location);
        if (date.getMinutes() < 10 && dateEnd.getMinutes() < 10) {
          eventTime.push(String(date.getHours()) + ":" + String(date.getMinutes()) + "0-" + String(dateEnd.getHours()) + ":" + String(dateEnd.getMinutes()) + "0")
        } else if (date.getMinutes() < 10) {
          eventTime.push(String(date.getHours()) + ":" + String(date.getMinutes()) + "0-" + String(dateEnd.getHours()) + ":" + String(dateEnd.getMinutes()))
        } else if (dateEnd.getMinutes() < 10) {
          eventTime.push(String(date.getHours()) + ":" + String(date.getMinutes()) + "-" + String(dateEnd.getHours()) + ":" + String(dateEnd.getMinutes()) + "0")
        } else {
          eventTime.push(String(date.getHours()) + ":" + String(date.getMinutes()) + "-" + String(dateEnd.getHours()) + ":" + String(dateEnd.getMinutes()))
        }

      });
    } else {
      console.log('No upcoming events found.');
    }
    return a;
  });
}



app.use("/public", express.static("public"));
app.set("view engine", "ejs");




app.get("/", (req, res) => {
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
  });

  res.render("landing", {
    eventList: eventList,
    eventDate: eventDate,
    eventLocation: eventLocation,
    eventTime: eventTime
  });
  eventList = [];
  eventDate = [];
  eventTime = [];
  eventLocation = [];
});

app.get("/proposals", (req, res) => {
  res.render("proposals");
});

app.get("/members", (req, res) => {
  res.render("members");
});

app.get("/petitions", (req, res) => {
  res.render("petitions");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/newMember", (req, res) => {
  res.render("newMember");
});

app.get("/newOrg", (req, res) => {
  res.render("newOrg");
});

app.get("/blog", (req, res) => {

  url = process.env.BLOGGER_API_KEY;

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      parsedResult = JSON.parse(body);

      res.render("blog", {
        parsedResult: parsedResult
      });

    }
  })
});

app.get("*", (req, res) => {
  res.render("error");
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Running on port 4000");
});