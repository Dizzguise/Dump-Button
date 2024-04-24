const { spawn } = require('child_process');
const { logger } = require('./logger');

function ffmpegProcessFactory() {
  let ffmpegProcess = null;

  function terminateFfmpegProcess() {
    if (!ffmpegProcess) {
      logger.info({action: 'terminated', msg: 'No process to terminate'});
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      logger.info({msg: 'Terminating FFmpeg process...'});

      ffmpegProcess.on('close', (code) => {
        logger.info({action: 'terminated', msg: 'FFmpeg process terminated', code});
        ffmpegProcess = null;
        resolve(true);
      });

      ffmpegProcess.on('error', (err) => {
        console.error('Error terminating FFmpeg process:', err);
        logger.error({action: 'terminated', msg: 'Error terminating process', err});
        reject(err);
      });

      ffmpegProcess.stdin.write('q');
      ffmpegProcess.stdin.end();
      //ffmpegProcess.child.kill('SIGTERM');
    });
  }

  function startFfmpegProcess(args) {
    ffmpegProcess = spawn('ffmpeg', args, { stdio: ['pipe', 'pipe', 'pipe'] });

    // ffmpegProcess.stderr.on('data', (data) => {
    //   //console.error(`FFmpeg stderr: ${data}`);
    //   //logger.info({process: 'ffmpeg', stderr: data})
    // });

    ffmpegProcess.on('close', (code) => {
      logger.info({process: 'ffmpeg', action: 'terminated', code});
      ffmpegProcess = null;
    });
  
    if (ffmpegProcess.pid) {
      return Promise.resolve(ffmpegProcess);
    } else {
      return new Promise((resolve, reject) => {
        ffmpegProcess.on('error', (err) => {
          logger.error({process: 'ffmpeg', err});
          //console.error('Failed to start FFmpeg process:', err);
          //res.status(500).send('Failed to start FFmpeg process.');
        });
      });
    }
  }

  return {
    ffmpegProcess,
    startFfmpegProcess,
    terminateFfmpegProcess,
  }
}


module.exports = {
  ffmpegProcessFactory,
};