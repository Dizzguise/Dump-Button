Streaming Management Application
This application allows you to manage live streams, seamlessly switching between live content from OBS and a pre-recorded dump video. It's designed to output directly to YouTube but can be configured for other streaming platforms.

Features
Start and stop live streaming from OBS.
Switch to a pre-recorded dump video without interrupting the stream.
Resume live streaming after the dump video has played.
Simple UI built with Tkinter for easy control.
Requirements
Python 3.x
Node.js
FFmpeg (for stream processing)
A media server capable of handling RTMP streams (e.g., Node-Media-Server)
Installation
Python Dependencies
Install the required Python package by running:

pip install -r requirements.txt
Node.js and Node-Media-Server
Install Node.js from here. This will also install npm, which is needed to install Node packages.

Clone or download the Node-Media-Server from its GitHub repository.

Navigate to the Node-Media-Server directory and run:

npm install
This will install all the necessary Node.js dependencies for the media server.

FFmpeg
Ensure FFmpeg is installed and accessible from your system's PATH. Installation instructions for FFmpeg can be found here.

Configuration
Python Script: No initial configuration needed, but ensure the SERVER_URL variable in the Python script matches the address of your Node.js server.

Node.js Server: In the Node.js script (streamserver.js), ensure the ports and any stream keys or paths are correctly set according to your setup.

Media Server: Configure your media server (if using Node-Media-Server, the configuration is in the Node.js script) to accept incoming streams from OBS and to forward them as needed.

Running the Application
Start the Node.js server (which includes the media server) by navigating to its directory and running:


node streamserver.js
Run the Python script to start the UI:


python DB1.0.py
Configure OBS to stream to your media server's RTMP address (e.g., rtmp://localhost/live).


Usage
Start Live Stream: Begins streaming from OBS to the configured destination (e.g., YouTube).
Stop All Streams: Stops all ongoing streams.
Trigger Dump Video: Switches the stream to the pre-recorded dump video.
Resume Live Stream: Returns to streaming live content from OBS.
Contributing
Contributions to this project are welcome! Please fork the repository and submit a pull request with your changes.


License
This project is open-source and available under the MIT License.
