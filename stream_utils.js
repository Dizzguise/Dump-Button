const { spawn } = require('child_process');
const { logger } = require('./logger');

class FfmpegProcessHandler {
  constructor() {
    this.ffmpegProcess = null;
  }

  startFfmpegProcess(args) {
    if (this.ffmpegProcess) {
      this.terminateFfmpegProcess(); // Ensure any existing process is stopped before starting a new one
    }

    this.ffmpegProcess = spawn('ffmpeg', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    this.ffmpegProcess.stderr.on('data', (data) => {
      console.error(`FFmpeg stderr: ${data}`);
      logger.info({process: 'ffmpeg', stderr: data});
    });

    this.ffmpegProcess.on('close', (code) => {
      logger.info({process: 'ffmpeg', action: 'terminated', code});
      this.ffmpegProcess = null;
    });

    if (this.ffmpegProcess.pid) {
      return Promise.resolve(this.ffmpegProcess);
    } else {
      return new Promise((resolve, reject) => {
        this.ffmpegProcess.on('error', (err) => {
          logger.error({process: 'ffmpeg', err});
          console.error('Failed to start FFmpeg process:', err);
          reject(err);
        });
      });
    }
  }

  terminateFfmpegProcess() {
    if (!this.ffmpegProcess) {
      logger.info({action: 'terminated', msg: 'No process to terminate'});
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      logger.info({msg: 'Terminating FFmpeg process...'});

      this.ffmpegProcess.on('close', (code) => {
        logger.info({action: 'terminated', msg: 'FFmpeg process terminated', code});
        this.ffmpegProcess = null;
        resolve(true);
      });

      this.ffmpegProcess.on('error', (err) => {
        console.error('Error terminating FFmpeg process:', err);
        logger.error({action: 'terminated', msg: 'Error terminating process', err});
        reject(err);
      });

<<<<<<< HEAD
      this.ffmpegProcess.stdin.write('q');
      this.ffmpegProcess.stdin.end();
=======
      ffmpegProcess.stdin.write('q');
      ffmpegProcess.stdin.end();
      //ffmpegProcess.child.kill('SIGTERM');
>>>>>>> 51c0759c6a4cb4fc39dad60cda3315c48c73d99e
    });
  }
}

function ffmpegProcessFactory() {
  return new FfmpegProcessHandler();
}

module.exports = {
  ffmpegProcessFactory
};
