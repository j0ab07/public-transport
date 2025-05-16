@echo off
start /B ngrok http 3000
echo Waiting for ngrok to start...
timeout /t 5
curl -s http://localhost:4040/api/tunnels | jq -r ".tunnels[0].public_url" > ngrok_url.txt
set /p NGROK_URL=<ngrok_url.txt
echo Ngrok URL: %NGROK_URL%
qrcode "%NGROK_URL%"
del ngrok_url.txt
pause