const axios = require('axios');
const req = require('express/lib/request');


const nativeAuthLadingPage = (request, response) => {
    response.render('native-login');
}


const nativeAuth = (request, response) => {
    console.log(request.query);

    const baseDomain = "https://accounts.google.com/o/oauth2/v2/";
    const authScope = "auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly";
    const includeGrantedScope = "&include_granted_scopes=true";
    const state = "&state=test";
    const redirectUri = "&redirect_uri=http://localhost:3000/success-native-auth";
    const clientId = `&client_id=${process.env.GOOGLE_CLIENT_ID}`
    const response_type = "&response_type=token"; 

    const fullUrl = baseDomain + authScope + includeGrantedScope + state + redirectUri + clientId + response_type;
    http://localhost:3000/nativelanding#state=test&access_token=ya29.A0ARrdaM9wyRKJ36lHZc82Sk5q3Zt8b-mjB2qPqdCKElgR0MrVFc35u_0O1fDcX_6FLga1PwnFw4RQ7t2aIKo4YeP5I07zyhHEraBHz8HL_USyMEJQmLo6G-Cejh4f5NZ29zGwJE0Iz-W2q4HTqufr2WxaX-jx&token_type=Bearer&expires_in=3599&scope=email%20profile%20openid%20https://www.googleapis.com/auth/contacts.readonly%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/calendar.readonly%20https://www.googleapis.com/auth/gmail.readonly&authuser=0&hd=nylas.com&prompt=consent

    console.log(fullUrl);
    response.redirect(fullUrl);
};

const nativeAuthSuccess = (request, response) => {
    console.log(request.originalUrl);

    response.render('success-native-auth', {
        ...response.req.query,
    });
}

module.exports = {
    nativeAuthLadingPage,
    nativeAuth,
    nativeAuthSuccess
}