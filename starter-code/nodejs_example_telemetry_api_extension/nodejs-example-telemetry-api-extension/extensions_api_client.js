const fetch = require('node-fetch');
const {basename} = require('path');

const REGISTRATION_REQUEST_BASE_URL = "???"

async function register() {
    console.info('[extensions-api:register] Registering using REGISTRATION_REQUEST_BASE_URL', REGISTRATION_REQUEST_BASE_URL);

    //OUR CODE GOES HERE

}

async function next(extensionId) {
    console.info('[extensions-api:next] Waiting for next event');

    //OUR CODE GOES HERE

}

module.exports = {
    register,
    next,
};