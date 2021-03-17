'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/signup.html`);
});

app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    console.log(`${firstName} ${lastName} ${email}`);

    const userData = {
        members: [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FName: firstName,
                LName: lastName
            }
        }]
    };

    const jsonUserData = JSON.stringify(userData);

    const mailchimpUrl = 'https://us1.api.mailchimp.com/3.0/lists/39103f4035';
    const options = {
        method: "POST",
        auth: "mary:6e9a36dafdd8258b85dc22f541e10b0a-us1"
    };

    const mailchimpRequest = https.request(mailchimpUrl, options, (mailchimpResponse) => {
        mailchimpResponse.on("data", (data) => {
            const responseBody = JSON.parse(data);
            const errors = responseBody.errors;

            console.log(mailchimpResponse.statusCode);
            mailchimpResponse.statusCode === 200 ? res.sendFile(`${__dirname}/success.html`) : res.sendFile(`${__dirname}/failure.html`);
        })
    });
    mailchimpRequest.write(jsonUserData);
    mailchimpRequest.end();
});

app.post('/failure.html', (req, res) => {
    res.redirect('/');
});


app.listen(3000, () => {
    console.log('Server started on 3000 port')

});

//6e9a36dafdd8258b85dc22f541e10b0a-us1
//39103f4035