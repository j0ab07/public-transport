import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { 
  Button, Switch, Typography, Container, Box,
   List, ListItem, ListItemText, Dialog, DialogTitle,
    DialogContent, DialogActions 
  } from '@mui/material';
import './App.css';
import { styles } from './AppStyles';


const App = () => {
  //Transit data
  const [transitInfo, setTransitInfo] = useState([]); //Stores bus/train info
  const [selectedRoute, setSelectedRoute] = useState(null); // Current selected route
  
  //UI/UX States
  const [highContrast, setHighContrast] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  
  //Voice Recognition
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const [error, setError] = useState('');
  const [queryLog, setQueryLog] = useState([]);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [showTravelTypeDialog, setShowTravelTypeDialog] = useState(false);
  const [showRouteDialog, setShowRouteDialog] = useState(false);
  const [lastErrorTime, setLastErrorTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);


  //Example buses
  const mockDerbyBuses = {
    'pride park': [
      { stop: 'Morledge', bus: '1A', operator: 'Arriva', destination: 'Pride Park', time: '15:30' },
      { stop: 'Morledge', bus: '1C', operator: 'Arriva', destination: 'Pride Park', time: '15:40' },
    ],
    'derby station': [
      { stop: 'Morledge', bus: 'i4', operator: 'Trentbarton', destination: 'Derby Station', time: '15:35' },
    ],
    'city centre': [
      { stop: 'Morledge', bus: '1C', operator: 'Arriva', destination: 'City Centre', time: '15:28' },
      { stop: 'Morledge', bus: '6.1', operator: 'Arriva', destination: 'City Centre', time: '15:33' },
    ],
    'morledge': [
      { stop: 'Morledge', bus: 'V1', operator: 'Trentbarton', destination: 'Morledge', time: '15:32' },
    ],
    'allestree': [
      { stop: 'Morledge', bus: '6.1', operator: 'Arriva', destination: 'Allestree', time: '15:38' },
    ],
    'alvaston': [
      { stop: 'Morledge', bus: '1A', operator: 'Arriva', destination: 'Alvaston', time: '15:34' },
    ],
    'chellaston': [
      { stop: 'Morledge', bus: '2A', operator: 'Arriva', destination: 'Chellaston', time: '15:37' },
    ],
  };

  //Example routes
  const mockRoutes = {
    '1A': ['Morledge', 'Derwent Street', 'Pride Park', 'Alvaston'],
    '1C': ['Morledge', 'Victoria Street', 'City Centre', 'Pride Park'],
    'i4': ['Morledge', 'Midland Road', 'Derby Station', 'Osmaston Road'],
    'V1': ['Morledge', 'Albert Street', 'City Centre', 'Burton Road'],
    '6.1': ['Morledge', 'Victoria Street', 'City Centre', 'Allestree'],
    '2A': ['Morledge', 'London Road', 'Osmaston Road', 'Chellaston'],
  };

  //Text-to-Speech
  const speak = (text) => {
    console.log('Speaking:', text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onend = () => console.log('Speech ended:', text);
    utterance.onerror = (e) => console.error('Speech error:', e);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  //Fetch Transit Data
  const getTransitData = (destination) => {
    const destinationLower = destination.toLowerCase();
    setQueryLog((prev) => [...prev, { destination, timestamp: new Date().toISOString() }]);

    const matchedKey = Object.keys(mockDerbyBuses).find((key) =>
      destinationLower.includes(key)
    );

    if (matchedKey) {
      const buses = mockDerbyBuses[matchedKey];
      const selectedBus = buses[0];
      const stops = mockRoutes[selectedBus.bus] || [];
      if (stops.length < 2) {
        const now = Date.now();
        if (!lastErrorTime || now - lastErrorTime > 5000) {
          setError('Invalid route: Not enough stops.');
          speak('Invalid route: Not enough stops.');
          setLastErrorTime(now);
        }
        return;
      }
      setTransitInfo(buses);
      setSelectedRoute({ bus: selectedBus.bus, destination: selectedBus.destination });
      setCurrentStopIndex(0);
      const summary = buses
        .map((bus) => `Bus ${bus.bus} to ${bus.destination} at ${bus.time}`)
        .join('. ');
      const stopsText = stops.length > 0 ? ` Stops: ${stops.join(', ')}.` : '';
      speak(`${summary}.${stopsText}`);
      navigator.vibrate?.([200, 100, 200]);
      setShowRouteDialog(false);
      setShowTravelTypeDialog(false);
      if (browserSupportsSpeechRecognition && micEnabled) {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else {
      const now = Date.now();
      if (!lastErrorTime || now - lastErrorTime > 5000) {
        setError('No buses found for this destination.');
        speak('No buses found for this destination.');
        setLastErrorTime(now);
      }
    }
  };

  const handleDestinationSelect = (destination) => {
    speak(`Selected ${destination}`);
    getTransitData(destination);
  };

  const getNextStop = () => {
    if (isProcessing || !selectedRoute || !mockRoutes[selectedRoute.bus]) {
      const now = Date.now();
      if (!lastErrorTime || now - lastErrorTime > 5000) {
        setError('No route selected. Select a destination first.');
        speak('No route selected. Select a destination first.');
        setLastErrorTime(now);
      }
      return;
    }
    setIsProcessing(true);
    const stops = mockRoutes[selectedRoute.bus];
    const nextIndex = currentStopIndex + 1;
    if (nextIndex < stops.length) {
      const nextStop = stops[nextIndex];
      setCurrentStopIndex(nextIndex);
      setError('');
      speak(`Next stop: ${nextStop}.`);
      navigator.vibrate?.([200, 100, 200]);
    } else {
      setError('You’ve reached the final stop.');
      speak('You’ve reached the final stop.');
      setSelectedRoute(null);
      setCurrentStopIndex(0);
      setTransitInfo([]);
      setMicEnabled(false);
      SpeechRecognition.stopListening();
      resetTranscript();
    }
    setIsProcessing(false);
  };

  const handleDestinationReached = () => {
    if (!selectedRoute || !mockRoutes[selectedRoute.bus]) {
      const now = Date.now();
      if (!lastErrorTime || now - lastErrorTime > 5000) {
        setError('No route selected. Select a destination first.');
        speak('No route selected. Select a destination first.');
        setLastErrorTime(now);
      }
      return;
    }
    const stops = mockRoutes[selectedRoute.bus];
    if (currentStopIndex === stops.length - 1) {
      setError('');
      speak('You have reached your destination.');
      setSelectedRoute(null);
      setCurrentStopIndex(0);
      setTransitInfo([]);
      setMicEnabled(false);
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      const now = Date.now();
      if (!lastErrorTime || now - lastErrorTime > 5000) {
        setError('You have not reached your destination yet.');
        speak('You have not reached your destination yet.');
        setLastErrorTime(now);
      }
    }
  };

  const exitRoute = () => {
    setSelectedRoute(null);
    setCurrentStopIndex(0);
    setTransitInfo([]);
    setError('');
    setMicEnabled(false);
    SpeechRecognition.stopListening();
    resetTranscript();
    speak('Route exited. Choose a new destination.');
    navigator.vibrate?.([200, 100, 200]);
  };

  const handleFetchTransit = () => {
    setShowTravelTypeDialog(true);
    setMicEnabled(true);
    setError('');
    setLastErrorTime(null);
    speak('What type of travel? Say Bus or Train.');
    if (browserSupportsSpeechRecognition) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  useEffect(() => {
    if (!transcript || !micEnabled || isProcessing) return;

    const command = transcript.toLowerCase().trim();
    console.log('Voice command:', command);
    if (command.includes('next bus')) {
      const destinationMatch = command.match(/(?:to|for)\s+(.+)/);
      const destination = destinationMatch ? destinationMatch[1].trim() : 'unknown';
      if (destination && destination !== 'unknown') {
        resetTranscript();
        getTransitData(destination);
      } else {
        const now = Date.now();
        if (!lastErrorTime || now - lastErrorTime > 5000) {
          setError('Please specify a destination, like Pride Park.');
          speak('Please specify a destination, like Pride Park.');
          setLastErrorTime(now);
        }
        if (browserSupportsSpeechRecognition && micEnabled) {
          resetTranscript();
          SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
        }
      }
    } else if (command.includes('reached this stop') || command.includes('next stop')) {
      resetTranscript();
      getNextStop();
      if (browserSupportsSpeechRecognition && micEnabled) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else if (command.includes('i have reached my destination')) {
      resetTranscript();
      handleDestinationReached();
      if (browserSupportsSpeechRecognition && micEnabled) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else if (
      command.includes('exit route') ||
      command.includes('exit this route') ||
      command.includes('exit the route') ||
      command.includes('i’m done')) 
    {
      resetTranscript();
      exitRoute();
    } else if (showTravelTypeDialog && (command.includes('bus') || command.includes('train'))) {
      resetTranscript();
      setShowTravelTypeDialog(false);
      setShowRouteDialog(true);
      setError('');
      setLastErrorTime(null);
      speak('Select a destination, like Pride Park or Derby Station.');
      if (browserSupportsSpeechRecognition && micEnabled) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else if (command.includes('go back')) {
      resetTranscript();
      if (showRouteDialog) {
        setShowRouteDialog(false);
        setShowTravelTypeDialog(true);
        setError('');
        setLastErrorTime(null);
        speak('What type of travel? Say Bus or Train.');
        if (browserSupportsSpeechRecognition && micEnabled) {
          SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
        }
      } else if (selectedRoute) {
        setShowTravelTypeDialog(true);
        setError('');
        setLastErrorTime(null);
        speak('What type of travel? Say Bus or Train.');
        if (browserSupportsSpeechRecognition && micEnabled) {
          SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
        }
      }
    }
  }, [transcript, showTravelTypeDialog, showRouteDialog, selectedRoute, micEnabled, isProcessing, lastErrorTime]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    if (!showTravelTypeDialog && !showRouteDialog && !selectedRoute && listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  }, [showTravelTypeDialog, showRouteDialog, selectedRoute, listening]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    const handleError = (event) => {
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        const now = Date.now();
        if (!lastErrorTime || now - lastErrorTime > 5000) {
          setError('Didn’t catch that. Try again.');
          speak('Didn’t catch that. Try again.');
          setLastErrorTime(now);
        }
        if (micEnabled && (showTravelTypeDialog || selectedRoute)) {
          resetTranscript();
          setTimeout(() => {
            SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
          }, 1000);
        } else {
          SpeechRecognition.stopListening();
          resetTranscript();
        }
      }
    };

    SpeechRecognition.onError = handleError;
    return () => {
      SpeechRecognition.onError = null;
    };
  }, [showTravelTypeDialog, selectedRoute, micEnabled, lastErrorTime]);

  useEffect(() => {
    if (queryLog.length > 0) {
      localStorage.setItem('queryLog', JSON.stringify(queryLog));
      console.log('Query Log:', queryLog);
    }
  }, [queryLog]);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    speak(highContrast ? 'High contrast off' : 'High contrast on');
  };


  return (
    <Container
      maxWidth="sm"
      style={{
        ...styles.container,
        backgroundColor: highContrast ? '#fff' : '#000',
        color: highContrast ? '#000' : '#fff',
      }}
    >
      <Typography
        variant="h4"
        style={{
          ...styles.transitText,
          color: highContrast ? '#000' : '#fff',
        }}
        aria-live="polite"
        role="status"
      >
        {transitInfo.length === 0 ? 'No transit data yet' : 'Next Buses'}
      </Typography>

      <List>
        {transitInfo.map((bus, index) => (
          <ListItem
            key={index}
            style={{
              backgroundColor: highContrast ? '#ddd' : '#333',
              margin: '5px 0',
            }}
          >
            <ListItemText
              primary={`Bus ${bus.bus} to ${bus.destination}`}
              secondary={`From ${bus.stop} at ${bus.time}`}
              primaryTypographyProps={{
                color: highContrast ? '#000' : '#fff',
                fontSize: '18px',
              }}
              secondaryTypographyProps={{
                color: highContrast ? '#333' : '#ccc',
                fontSize: '16px',
              }}
            />
          </ListItem>
        ))}
      </List>

      {selectedRoute && mockRoutes[selectedRoute.bus] && (
        <Box>
          <Typography
            variant="h6"
            style={{
              ...styles.transitText,
              color: highContrast ? '#000' : '#fff',
              fontSize: '20px',
            }}
            aria-live="polite"
            role="status"
          >
            Stops on Bus {selectedRoute.bus}:
          </Typography>
          <List>
            {mockRoutes[selectedRoute.bus].map((stop, index) => (
              <ListItem
                key={index}
                style={{
                  backgroundColor: index === currentStopIndex ? (highContrast ? '#aaa' : '#555') : (highContrast ? '#ddd' : '#333'),
                  margin: '5px 0',
                }}
              >
                <ListItemText
                  primary={stop}
                  primaryTypographyProps={{
                    color: highContrast ? '#000' : '#fff',
                    fontSize: '16px',
                    fontWeight: index === currentStopIndex ? 'bold' : 'normal',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {error && (
        <Typography
          style={{
            ...styles.errorText,
            color: highContrast ? '#d00' : '#ff4444',
          }}
          aria-live="assertive"
          role="alert"
        >
          {error}
        </Typography>
      )}

      <Button
        variant="outlined"
        onClick={handleFetchTransit}
        style={styles.fetchButton(highContrast)}
        aria-label="Fetch transit information"
        role="button"
      >
        Fetch Transit
      </Button>

      {selectedRoute && (
        <Button
          variant="contained"
          onClick={exitRoute}
          style={styles.exitButton(highContrast)}
          aria-label="Exit current route"
          role="button"
        >
          Exit Route
        </Button>
      )}

      <Box style={styles.toggleContainer}>
        <Box display="flex" alignItems="center">
          <Typography
            style={{
              ...styles.toggleLabel,
              color: highContrast ? '#000' : '#fff',
            }}
            aria-label="High contrast mode"
          >
            High Contrast
          </Typography>
          <Switch
            checked={highContrast}
            onChange={toggleHighContrast}
            aria-label={highContrast ? 'Turn off high contrast' : 'Turn on high contrast'}
            role="switch"
          />
        </Box>
      </Box>

      <Dialog
        open={showTravelTypeDialog}
        onClose={() => {
          setShowTravelTypeDialog(false);
          setMicEnabled(false);
          SpeechRecognition.stopListening();
          resetTranscript();
        }}
        aria-labelledby="travel-type-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="travel-type-dialog-title">What Type of Travel?</DialogTitle>
        <DialogContent>
          <Typography>Say "Bus" or "Train"</Typography>
          <List>
            <ListItem aria-label="Bus">
              <ListItemText primary="Bus" />
            </ListItem>
            <ListItem aria-label="Train">
              <ListItemText primary="Train" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowTravelTypeDialog(false);
              setMicEnabled(false);
              SpeechRecognition.stopListening();
              resetTranscript();
            }}
            style={{ color: highContrast ? '#000' : '#007AFF' }}
            aria-label="Cancel"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showRouteDialog}
        onClose={() => {
          setShowRouteDialog(false);
          setMicEnabled(false);
          SpeechRecognition.stopListening();
          resetTranscript();
        }}
        aria-labelledby="route-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="route-dialog-title">Select Your Destination</DialogTitle>
        <DialogContent>
          <Typography>Select a destination, like Pride Park or Derby Station</Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center">
            {Object.keys(mockDerbyBuses).map((destination) => (
              <Button
                key={destination}
                variant="contained"
                onClick={() => handleDestinationSelect(destination)}
                style={styles.destinationButton(highContrast)}
                aria-label={`Select ${destination}`}
                role="button"
              >
                {destination.charAt(0).toUpperCase() + destination.slice(1)}
              </Button>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowRouteDialog(false);
              setShowTravelTypeDialog(true);
              setError('');
              setLastErrorTime(null);
              speak('What type of travel? Say Bus or Train.');
              if (browserSupportsSpeechRecognition) {
                setMicEnabled(true);
                resetTranscript();
                SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
              }
            }}
            style={{ color: highContrast ? '#000' : '#007AFF' }}
            aria-label="Go back"
          >
            Go Back
          </Button>
          <Button
            onClick={() => {
              setShowRouteDialog(false);
              setMicEnabled(false);
              SpeechRecognition.stopListening();
              resetTranscript();
            }}
            style={{ color: highContrast ? '#000' : '#007AFF' }}
            aria-label="Cancel"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;