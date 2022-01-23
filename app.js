const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');
const log = console.log;

require('dotenv').config()

app.set('view engine', 'pug')
app.set("views", path.join(__dirname, "views"));

app.listen(3000, () => {
    log("\nApplication started and Listening on port 3000\n");
});

app.get('/', (request, response) => {
    response.render('index');
});

app.get('/hostedauth', (request, response) => {
    const serverOrClientEnum = request._parsedUrl.query;

    log("\nSending a GET request to https://api.nylas.com/oauth/authorize\n");

    axios.get('https://api.nylas.com/oauth/authorize', {
        header: {
            Authorization: `Basic ${process.env.B64_CLIENT_SECRET}`
        },
        params: {
            client_id: process.env.CLIENT_ID,
            redirect_uri: "http://localhost:3000/success-hostedauth-server",
            scopes: "email.read_only,calendar.read_only,contacts.read_only",
            response_type: serverOrClientEnum,
            login_hint: "my_email@example.com",
            state: "MyCustomStateString",
        }
    })
    .then(resp => {
        response.redirect(resp.request.res.responseUrl);
        log(`\nRedirecting to responseUrL: ${resp.request.res.responseUrl}\n`);
    })
    .catch(error => {
        log(error);
    })
});

app.get('/success-hostedauth-server', (request, response) => {
    
    // CLIENT request
    if (Object.keys(request.query).indexOf("access_token") >= 0) {
        log("Access token retrieved:");
        log(response.req.query);
        response.render('success-hostedauth-server', {
            ...response.req.query
        });
    }
    // SERVER-SIDE request
    else {
        log("Returning server code and state (if included)...\n")
        log(response.req.query);
        log("\nSending server code to /oauth/token\n");
        axios.get('https://api.nylas.com/oauth/token', {
            header: {
                Authorization: "Basic OXd1YjdlODBsZ29wajUwMWlvMXY0NnQwajo="
            },
            params: {
                client_id: "1ueigxdg25qbihsknzsctwvf2",
                client_secret: "9wub7e80lgopj501io1v46t0j",
                grant_type: "authorization_code",
                code: response.req.query.code
            }
        })
        .then (resp => {
            log("Access token retrieved:")
            log(resp.data);
            response.render('success-hostedauth-server', {
                ...response.req.query,
                ...resp.data
            });
        })
        .catch(error => {
            log(error);
        })
    }
});

