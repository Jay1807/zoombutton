import xapi from 'xapi';

let meetingId = ''; // Variable to store meeting ID

function promptForMeetingPasscode() {
    xapi.command('UserInterface Message TextInput Display', {
        FeedbackId: 'zoom_meeting_passcode',
        Title: "Zoom Meeting Passcode",
        Text: 'Enter the Zoom Meeting Passcode (leave blank if none):',
        InputType: 'Numeric',
        Placeholder: 'Passcode (optional)',
        SubmitText: 'Join',
    });
}

function promptForMeetingID() {
    xapi.command('UserInterface Message TextInput Display', {
        FeedbackId: 'zoom_meeting_id',
        Title: "Join Zoom Meeting",
        Text: 'Enter the Zoom Meeting ID:',
        InputType: 'Numeric',
        Placeholder: 'Meeting ID',
        SubmitText: 'Next',
    });
}

xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    if (event.PanelId === 'zoomid') {
        promptForMeetingID();
    }
});

xapi.event.on('UserInterface Message TextInput Response', (event) => {
    if (event.FeedbackId === 'zoom_meeting_id') {
        meetingId = event.Text.trim(); // Store the meeting ID
        promptForMeetingPasscode(); // Next, ask for the passcode
    } else if (event.FeedbackId === 'zoom_meeting_passcode') {
        const passcode = event.Text.trim();
        // Construct the dial string based on whether a passcode was provided
        const zoomFormat = passcode ? `${meetingId}.${passcode}@zoomcrc.com` : `${meetingId}@zoomcrc.com`;
        xapi.command('Dial', { Number: zoomFormat });
    }
});
