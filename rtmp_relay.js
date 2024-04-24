const NodeMediaServer = require('node-media-server');
const { getSettings } = require('./settings');
const { spawn } = require('child_process');

// Node-Media-Server configuration
const config = {
    rtmp: {
        port: 1935,
        chunk_size: 12000,
        gop_cache: false,
        ping: 60,
        ping_timeout: 30
    },
    http: {
        port: getSettings().NMSPORT, // Make sure this matches the nmsPort variable
        mediaroot: './media',
        allow_origin: '*'
    },
    relay: {
        ffmpeg: 'ffmpeg',
        tasks: [
            // Initial empty tasks array, will populate dynamically
        ]
    }
};

const nms = new NodeMediaServer(config);

nms.on('postPublish', (id, streamPath, args) => {
    const streamKey = streamPath.split('/').pop();
    // Decide where to forward the stream based on the streamKey
    if (streamKey === 'youtube') {
        startRelay(streamKey, getSettings().YOUTUBEURI);
    } else if (streamKey === 'rumble') {
        startRelay(streamKey, getSettings().RUMBLEURI);
    }
});

function startRelay(streamKey, outputUri) {
    // Construct the command to start the relay
    const ffmpegArgs = [
        '-i', `rtmp://localhost/live/${streamKey}`,
        '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv',
        outputUri
    ];

    const ffmpeg = spawn('ffmpeg', ffmpegArgs);

    ffmpeg.stdout.on('data', (data) => {
        console.log(`FFmpeg ${streamKey}: ${data}`);
    });

    ffmpeg.stderr.on('data', (data) => {
        console.error(`FFmpeg ${streamKey} Error: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        console.log(`FFmpeg ${streamKey} process exited with code ${code}`);
    });
}

module.exports = { nms };
