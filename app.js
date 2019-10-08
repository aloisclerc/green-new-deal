const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require('fs');
const readline = require('readline');
let eventList = [];
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
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

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
        const start = event.start.dateTime || event.start.date;
        eventList.push(`${start} - ${event.summary}`)
      });
    } else {
      console.log('No upcoming events found.');
    }
    return a;
  });
}



mongoose.connect("mongodb://localhost/green_new_deal");
app.use("/public", express.static("public"));
app.set("view engine", "ejs");

//SCHEMA SETUP
const memberSchema = new mongoose.Schema({
  name: String,
  contactInfo: String,
  objective: String,
  website: String
});

let Member = mongoose.model("Member", memberSchema);


app.get("/", (req, res) => {
  let url = "https://www.googleapis.com/calendar/v3/calendars/alois.clerc@gmail.com/events/eventId";

  request(url, (error, response, body) => {
    console.log(error);
    console.log(response.statusCode);
    if (!error && response.statusCode == 200) {
      parsedResult = JSON.parse(body);
      console.log(parsedResult);
      // res.send(parsedResult["Search"][0]["Title"]);
    }
  })
  //apikey=AIzaSyBy74-kyDlOgV9COJjINbYF_4rBbzA5Xb0
  //blogID=1781114122937363139
  console.log(eventList);
  res.render("landing", {eventList: eventList});
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

app.get("/new", (req, res) => {
  res.render("new");
});

app.get("/blog", (req, res) => {

  url = "https://www.googleapis.com/blogger/v3/blogs/1781114122937363139/posts?key=AIzaSyBy74-kyDlOgV9COJjINbYF_4rBbzA5Xb0";

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      parsedResult = JSON.parse(body);
      res.render("blog", {
        parsedResult: parsedResult
      });
      // res.send(parsedResult["Search"][0]["Title"]);
    }
  })
});

app.get("*", (req, res) => {
  res.render("error");
});

app.listen(4000, () => {
  console.log("Running on port 3000");
});