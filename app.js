'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/signup.html`);
});

app.post('/', (req, res) => {
    sendUserDataToMailchimp(res, getUserData(req));
});

app.post('/failure.html', (req, res) => {
    res.redirect('/');
});

app.listen(process.env.PORT  || 3000, () => {
    console.log('Server started on 3000 port')
});

function sendUserDataToMailchimp(res, userData) {
    const mailchimpUrl = 'https://us1.api.mailchimp.com/3.0/lists/39103f4035';
    const options = {
        method: "POST",
        auth: "mary:6e9a36dafdd8258b85dc22f541e10b0a-us1"
    };
    const mailchimpRequest = https.request(mailchimpUrl, options, (mailchimpResponse) => {
        mailchimpResponse.on("data", (data) => {
            mailchimpResponse.statusCode === 200 ? res.sendFile(`${__dirname}/success.html`) : res.sendFile(`${__dirname}/failure.html`);
        });
    });
    mailchimpRequest.write(userData);
    mailchimpRequest.end();
}

function getUserData(req) {
    return JSON.stringify({
        members: [{
            email_address: req.body.email,
            status: 'subscribed',
            merge_fields: {
                FName: req.body.fName,
                LName: req.body.lName
            }
        }]
    });
}