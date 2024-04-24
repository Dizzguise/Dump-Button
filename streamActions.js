const { logger } = require('./logger');
const { getSettings } = require('./settings');

const { ffmpegProcessFactory } = require('./stream_utils');

const ffmpegYoutube = ffmpegProcessFactory();
const ffmpegRumble = ffmpegProcessFactory();

const  delay = (n) => new Promise(r => setTimeout(r, n));

const streamActions = {
  async startYoutube() {
    const liveArgs = ['-i', 'rtmp://localhost/live', '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv'];
    liveArgs.push(getSettings().YOUTUBEURI);
    await ffmpegYoutube.terminateFfmpegProcess();
    //await delay(getSettings().SWITCHDELAY);
    await ffmpegYoutube.startFfmpegProcess(liveArgs);
  },
  async stopYoutube() {
    await ffmpegYoutube.terminateFfmpegProcess();
  },
  async dumpYoutube() {
    const dumpArgs = ['-stream_loop', '-1', '-re', '-i', getSettings().DUMPVIDEO, '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv'];
    dumpArgs.push(getSettings().YOUTUBEURI);
    await ffmpegYoutube.terminateFfmpegProcess();
    //await delay(getSettings().SWITCHDELAY);
    await ffmpegYoutube.startFfmpegProcess(dumpArgs);
  },

  async startRumble() {
    const liveArgs = ['-i', 'rtmp://localhost/live', '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv'];
    liveArgs.push(getSettings().RUMBLEURI);
    await ffmpegRumble.terminateFfmpegProcess();
    //await delay(getSettings().SWITCHDELAY);
    await ffmpegRumble.startFfmpegProcess(liveArgs);
  },
  async stopRumble() {
    await ffmpegRumble.terminateFfmpegProcess();
  },
  async dumpRumble() {
    const dumpArgs = ['-stream_loop', '-1', '-re', '-i', getSettings().DUMPVIDEO, '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv'];
    dumpArgs.push(getSettings().RUMBLEURI);
    await ffmpegRumble.terminateFfmpegProcess();
    //await delay(getSettings().SWITCHDELAY);
    await ffmpegRumble.startFfmpegProcess(dumpArgs);
  },
};

module.exports = streamActions;
