const NodeMediaServer = require('node-media-server');

const { getSettings } = require('./settings');

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
        port: getSettings().NMSPORT, // Ensure this matches the nmsPort variable
        mediaroot: './media',
        allow_origin: '*'
    }
};

const nms = new NodeMediaServer(config);

module.exports = { nms };