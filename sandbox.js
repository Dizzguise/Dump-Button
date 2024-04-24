const readline = require('readline');
const { nms } = require('./rtmp_relay');
const streamActions = require('./streamActions');

// this starts the rtmp proxy
nms.run();

// delayte function 
const  delay = (n) => new Promise(r => setTimeout(r, n));    

const pressAnyKey = async () => {
    return new Promise(resolve => {
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        console.log('Press any key to continue...');

        process.stdin.once('keypress', () => {
        process.stdin.setRawMode(false);
        resolve();
        });
    });
};
  

async function sandbox() {
    await pressAnyKey();
    await streamActions.startYoutube();
    await delay(1000 * 60); // 60 seconds
    await streamActions.dumpYoutube();
    await delay(1000 * 60); // 60 seconds
    await streamActions.startYoutube();
    await delay(1000 * 120); // 120 seconds
    await streamActions.stopYoutube();
}


sandbox().then(() => {
    console.log("finsihed");
});