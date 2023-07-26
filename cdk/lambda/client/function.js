const MAX_SLEEP = 3*1000;
const ERROR_RATE = 10;
const THROW_ERRORS = process.env.THROW_ERRORS || false;

console.log(`Throw error is ${(THROW_ERRORS) ? 'enabled':'disabled'}`)

exports.handler = async (event) => {
    if(THROW_ERRORS) {
        throwError();
    }

    const time = randomSleep();
    console.log(`Sleeping ${time} ms`);

    await sleep(time);

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };

    return response;
};

// throw randomized error based on ERROR_RATE constant
function throwError() {
    if (Math.floor(Math.random() * 100) < ERROR_RATE) {
        throw new Error('Oh no! We got an error :(');
    }
}

// randomize a number between 0 and MAX_SLEEP constant
function randomSleep() {
    return Math.floor(Math.random() * MAX_SLEEP);
}

// sleep the code
async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}