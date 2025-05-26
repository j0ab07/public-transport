# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

Before running the project, ensure you have the following installed:
- Node.js and npm (for running the React app)
- Python (for running the `ngrok-qr.bat` script)
- Install Python dependencies from `requirements.txt`:

  ```bash
  pip install -r requirements.txt
  ```

  This installs `jq` and `qrcode` required for the `ngrok-qr.bat` script.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.  
You may also see any lint errors in the console.

## 📱 Accessing the App on Mobile (Using ngrok)

To test this app on a real mobile device:

1. Make sure your app is running locally:

   ```bash
   npm start
   ```

   By default, this runs at http://localhost:3000.

2. Install ngrok and run one of the following in a separate terminal:

   ### Option 1: Run ngrok Directly
   ```bash
   ngrok http 3000
   ```

   ngrok will provide a public URL, such as:

   ```
   https://your-subdomain.ngrok-free.app
   ```

3. Open that public URL in your mobile browser (on the same or different network).

   ### Option 2: Run ngrok with QR Code (Windows)
   To easily share the ngrok URL on a mobile device using a QR code, use the provided `ngrok-qr.bat` script:

   - Ensure `ngrok`, `jq`, and `qrcode` are installed and accessible in your system PATH (installed via `requirements.txt`).
   - Run the following command in a terminal from the project directory:
   
     ```bash
     ngrok-qr.bat
     ```

   - The script will:
     - Start ngrok on port 3000.
     - Fetch the public ngrok URL.
     - Display the URL in the terminal.
     - Generate a QR code in the terminal for easy scanning with a mobile device.
     - Pause to allow you to scan the QR code or copy the URL.

   - Scan the QR code with your mobile device's camera or QR code reader to open the URL in your mobile browser.

You can now use and test the app on any mobile device.

## 🗣️ Voice Commands

The app supports voice commands for hands-free navigation. Ensure the microphone is enabled (indicated by the "Voice Input Active" badge). The following voice commands are available:

- **Select a route**: Say "next bus to [destination]" (e.g., "next bus to Full Street") to select a route.
- **Advance to next stop**: Say "next stop" or "reached this stop" to move to the next stop on the route.
- **Get off at current stop**: Say "get off here," "stop here," or "get off" to exit at the current stop.
- **Confirm destination reached**: Say "I have reached my destination" to confirm arrival at the final stop.
- **Exit route**: Say "exit route," "exit this route," "exit the route," or "I’m done" to end the current journey.
- **Cancel route selection**: Say "go back" while in the route selection dialog to cancel.
- **Read journey logs**: Say "read logs" to hear a summary of your journey history.
- **Clear journey logs**: Say "clear logs" to remove all journey logs.
- **Check current time**: Say "what time is it" or "tell me the time" to hear the current time.
- **Get help**: Say "help" or "what can I say" to hear the list of available voice commands.

### Notes on Voice Commands
- Voice commands are case-insensitive and require a clear microphone input.
- Ensure your browser supports speech recognition (e.g., Chrome).
- If no speech is detected, the app will prompt you to try again after a short delay.

### `npm test`

Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)