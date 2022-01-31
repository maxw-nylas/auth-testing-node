const axios = require('axios');
const colors = require('colors');
const log = console.log;

const hostedAuth = (request, response) => {
    const serverOrClientEnum = request._parsedUrl.query;

    log("\nSending a GET request to https://api.nylas.com/oauth/authorize\n".green);

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
        log(`\nRedirecting to responseUrL: ${resp.request.res.responseUrl}\n`.green);
    })
    .catch(error => {
        log(error.toJSON());
    })
}

const hostedAuthSuccess = (request, response) => {
    
    // CLIENT request
    if (Object.keys(request.query).indexOf("access_token") >= 0) {
        log("Access token retrieved:");
        log(response.req.query);
        response.render('success', {
            ...response.req.query,
            requestType: 'Client-side'
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
            response.render('success', {
                ...response.req.query,
                ...resp.data,
                requestType: 'Server-side'
            });
        })
        .catch(error => {
            log(error);
        })
    }
}

module.exports = {
    hostedAuth,
    hostedAuthSuccess
}