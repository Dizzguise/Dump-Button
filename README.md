---THIS IS POC ONLY---

Overview
A dump button, with output for both Youtube and Rumble. *WIP*


Features
Live RTMP streaming using Node-Media-Server.
Dynamic stream relay configuration based on stream keys.
FFmpeg integration for video stream processing and relaying.
Custom logging with Pino for efficient debugging and monitoring.
Environment-based configuration management for portability and ease of deployment.

Prerequisites
Node.js (v14.x or higher recommended)
FFmpeg installed and available in your system's PATH.

Installation

Clone the Repository


git clone https://github.com/yourgithubusername/your-repository-name.git
cd your-repository-name

Install Dependencies

npm install


FFmpeg Installation

Ensure FFmpeg is installed on your system. Below are the installation steps for different operating systems:

Windows

Download the FFmpeg builds from FFmpeg Official Site.
Extract the files to a known location (e.g., C:\FFmpeg).
Add C:\FFmpeg\bin to your system's PATH.
Linux
For Debian-based distributions:

sudo apt update
sudo apt install ffmpeg

For Red Hat-based distributions:

sudo yum install ffmpeg

macOS
Using Homebrew:

brew install ffmpeg
Configuration
Copy the example configuration file and modify it to match your environment settings:

cp settings.example.json settings.json
Edit settings.json to update the settings such as ports and file paths as needed.


Usage
To start the application, run:

npm start
This command will launch the Electron application and initiate the Node-Media-Server, listening for incoming RTMP streams.

Development
Running in Development Mode
To run the application in development mode:

npm run dev
Debugging
Logs are written to the logs directory. Monitor these logs for debugging and operational insights.

Contribution
Contributions are welcome. Please fork the repository, make your changes, and submit a pull request.

License
This project is licensed under the MIT License. Contributions must adhere to this license.
