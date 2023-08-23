const express = require('express');
const { render } = require('express/lib/response');
const {google} = require('googleapis');
const path = require('path');
const GOOGLE_APPLICATION_CREDENTIALS = './credentials.json';
const app = express();
const spreadsheetId = '1Pua7Qa8pTm-5l2GXHHJVoOpkS2ny7u-AIGSzxTU1yTA';
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/',async (req, res) => {
    res.render('index');
});
app.post('/',async (req, res) => {
    const {name,phone} = req.body;
    //create a google autn client for service account   
    const auth = new google.auth.GoogleAuth({
        keyFile:GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: 'v4', auth: client});
    //get metdata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId: spreadsheetId,
    });

    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId: spreadsheetId,
        range: 'גיליון1!A:B',
        valueInputOption: 'USER_ENTERED',
        resource: { 
            values: [
                [name,phone]
            ]       
        },
    });
    res.send('success');
});


app.listen(3000,() => {
    console.log('Example app listening on port 3000!');
});

