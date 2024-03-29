import tkinter as tk
from tkinter import messagebox
import requests

# Configuration
SERVER_URL = 'http://localhost:8300'  # Make sure this matches your Node.js server

def send_request(endpoint, success_message, error_message):
    try:
        response = requests.get(f'{SERVER_URL}/{endpoint}')
        if response.status_code == 200:
            messagebox.showinfo('Success', success_message)
        else:
            messagebox.showerror('Error', f'{error_message}: {response.text}')
    except Exception as e:
        messagebox.showerror('Error', f'{error_message}: {str(e)}')

def start_live():
    send_request('start-live', 'Live streaming started successfully.', 'Failed to start live streaming')

def stop_stream():
    send_request('stop-stream', 'All streams stopped successfully.', 'Failed to stop streams')

def trigger_dump():
    send_request('trigger-dump', 'Dump video streaming started successfully.', 'Failed to start dump video streaming')

def resume_live():
    send_request('resume-live', 'Live streaming resumed successfully.', 'Failed to resume live streaming')

# Simplified Tkinter UI setup
app = tk.Tk()
app.title('Streaming Control Panel')
app.configure(bg='#333333')
foreground_color, button_background = '#FFFFFF', '#555555'

# Button setup with unified styling
buttons = {
    'Start Live Stream': start_live,
    'Stop All Streams': stop_stream,
    'Trigger Dump Video': trigger_dump,
    'Resume Live Stream': resume_live
}

for text, command in buttons.items():
    tk.Button(app, text=text, command=command, fg=foreground_color, bg=button_background).pack(pady=5)

app.mainloop()
