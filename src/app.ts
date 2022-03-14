//////////////рандомные видео с ютуба по одному клику



// const msg: string = 'Hello world';
// console.log(msg);
//const bootstrap = require('bootstrap');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
//gS54xMvGPoGc0jYs

const crt = '../crt/X509-cert-8299923995313901438.cer';
//const crt2 = fs.readFileSync(crt);


app.set('view engine', 'ejs');

const dbURI = 'mongodb+srv://playground-cluster.6pr4i.mongodb.net/hw-1-db?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority'
mongoose.connect(dbURI, {
    //  useNewUrlPaser: true,  
    useUnifiedTopology: true,
    sslKey: crt,
    sslCert: crt

})
    .then(result => console.log('connected to DB via mongoose'))
    .then(result => app.listen(3000))
    .catch(err => console.log(err));


var readline = require('readline');
var { google } = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('../crt/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(JSON.parse(content), getVideo);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) throw err;
        console.log('Token stored to ' + TOKEN_PATH);
    });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
 function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

var _id: string = '';
var _ids = [];
function getVideo(auth) {
    var service = google.youtube('v3');
    service.videos.list({
        auth: auth,
        part: 'snippet,contentDetails,statistics',
        //forUsername: 'GoogleDevelopers'
        chart: "mostPopular"
        //regionCode: "US"
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var videos = response.data.items;
        if (videos.length == 0) {
            console.log('No videos found.');
        } else {
            console.log(videos.length);
            console.log('This video\'s ID is %s. Its title is \'%s\', and ' +
                'it has %s views.',
                videos[0].id,
                videos[0].snippet.title,
                videos[0].statistics.viewCount);
            videos.forEach(element => {
                _ids.push(element.id);
            });
            console.log(videos);
            _id = _ids[getRandomInt(_ids.length)];
            console.log(`link for "random" embed video: https://www.youtube.com/embed/${_id}`);
            console.log(_ids);
            
        }
    });
}

app.get('/', (req, res) => {
    res.render('index', { video_id: _ids[getRandomInt(_ids.length)] });
});