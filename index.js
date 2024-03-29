const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const NodeMediaServer = require('node-media-server');

const express = require('express');
const { spawn } = require('child_process');

dotenv.config();

function getSettings() {
    const defaultSettings = {
        NMSPORT: 8200,  // Port for Node-Media-Server
        APPPORT: 8300,  // Port for Express app
    }
   
    const settingsPath = path.join(__dirname, 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

    const mergedSettings = { ...defaultSettings, ...process.env, ...settings };    

    return mergedSettings;
}

const app = express();

// Node-Media-Server configuration
const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
    },
    http: {
        port: getSettings().NMSPORT, // Ensure this matches the nmsPort variable
        mediaroot: './media',
        allow_origin: '*'
    }
};

const nms = new NodeMediaServer(config);
nms.run();

let ffmpegProcess = null;

function terminateFfmpegProcess() {
    if (ffmpegProcess) {
        console.log('Terminating FFmpeg process...');
        ffmpegProcess.stdin.write('q'); // Gracefully quit FFmpeg
        ffmpegProcess.stdin.end();
        ffmpegProcess = null;
    }
}

function startFfmpegProcess(args, res, message) {
    terminateFfmpegProcess(); // Ensure any existing process is terminated

    ffmpegProcess = spawn('ffmpeg', args, { stdio: ['pipe', 'pipe', 'pipe'] });

    ffmpegProcess.stderr.on('data', (data) => {
        console.error(`FFmpeg stderr: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
        console.log(`${message} terminated with code ${code}`);
        ffmpegProcess = null;
    });

    ffmpegProcess.on('error', (err) => {
        console.error('Failed to start FFmpeg process:', err);
        res.status(500).send('Failed to start FFmpeg process.');
    });

    console.log(message);
    res.send(message);
}

// Endpoint to start live streaming
app.get('/start-live', (req, res) => {
    const liveArgs = ['-i', 'rtmp://localhost/live', '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv', getSettings().STREAMURI];
    startFfmpegProcess(liveArgs, res, 'Live streaming started');
});

app.get('/resume-live', (req, res) => {
    const liveArgs = ['-i', 'rtmp://localhost/live', '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv', getSettings().STREAMURI];
    startFfmpegProcess(liveArgs, res, 'Live streaming resumed');
});

// Endpoint to stop all streams
app.get('/stop-stream', (req, res) => {
    terminateFfmpegProcess();
    res.send('All streams stopped.');
});

// Endpoint to trigger dump stream
app.get('/trigger-dump', (req, res) => {
    const dumpArgs = ['-re', '-i', 'E:/dump.mp4', '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv', getSettings().STREAMURI];
    startFfmpegProcess(dumpArgs, res, 'Dump video streaming started');
});

const appPort = getSettings().APPPORT;
const appHost = getSettings().APPHOST;
app.listen(appPort, appHost, () => {
    console.log(`Express server running at http://${appHost}:${appPort}`);
});
