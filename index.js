require('dotenv').config();
const express = require('express');
const { render } = require('express/lib/response');
const {google} = require('googleapis');
const path = require('path');
const {JWT} = require('google-auth-library');
const { GoogleSpreadsheet } = require('google-spreadsheet');





const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;




app.use(express.static(path.join(__dirname, 'public')));
app.get('/',async (req, res) => {
    //create a google autn client for service account
    const auth = new JWT({
        email: process.env.CLIENT_EMAIL,
        key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    res.render('index');


    /* const doc = new GoogleSpreadsheet(spreadsheetId, auth);
    await doc.loadInfo();
    console.log(doc.sheetsByIndex[0]); */
    

});
app.post('/',async (req, res) => {
    const {name,phone} = req.body;
    const spreadsheetId = process.env.SPREAD_SHEET_ID;
    //create a google autn client for service account   
    const auth = new JWT({
        email: process.env.CLIENT_EMAIL,
        key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    //get metdata about spreadsheet
    const doc = new GoogleSpreadsheet(spreadsheetId, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({Name:name,PhoneNumber:phone});
    //read rows from spreadsheet
    res.redirect('/?message=!הפרטים נשלחו בהצלחה');
});


app.listen(port,() => {
    console.log(`Example app listening on port ${port}!`);
});

