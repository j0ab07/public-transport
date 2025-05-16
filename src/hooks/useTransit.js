import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { mockDerbyBuses, mockRoutes } from '../data/mockData';
import { speak } from '../utils/speech';

// Custom hook to manage transit-related state and logic
const useTransit = () => {
  // State for storing bus information
  const [transitInfo, setTransitInfo] = useState([]);
  // State for the currently selected route
  const [selectedRoute, setSelectedRoute] = useState(null);
  // State for enabling/disabling microphone
  const [micEnabled, setMicEnabled] = useState(false);
  // Speech recognition hook for voice commands
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  // State for error messages
  const [error, setError] = useState('');
  // State for logging user queries and get-off events
  const [queryLog, setQueryLog] = useState([]);
  // State for tracking the current stop index
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  // State for showing the route selection dialog
  const [showRouteDialog, setShowRouteDialog] = useState(false);
  // State for tracking the last error time to prevent spamming
  const [lastErrorTime, setLastErrorTime] = useState(null);
  // State to prevent concurrent processing
  const [isProcessing, setIsProcessing] = useState(false);

  // Map of destination synonyms for flexible matching
  const destinationSynonyms = {
    'university': 'university bus park',
    'hospital': 'royal hospital entrance',
    'derby hospital': 'royal hospital entrance',
    'royal derby': 'royal hospital entrance',
    'uttoxeter': 'uttoxeter bus station',
    'derby': 'derby bus station',
    'beetwell': 'new beetwell street',
    'high': 'high street',
  };

  // Fetch transit data for a given destination
  const getTransitData = (destination) => {
    const destinationLower = destination.toLowerCase().trim();
    // Log the query
    setQueryLog((prev) => [
      ...prev,
      { type: 'destination', destination, timestamp: new Date().toISOString() },
    ]);

    // Check for synonyms
    const resolvedDestination = destinationSynonyms[destinationLower] || destinationLower;
    // Find a matching destination in mock data
    const matchedKey = Object.keys(mockDerbyBuses).find((key) =>
      resolvedDestination.includes(key) || key.includes(resolvedDestination)
    );

    if (matchedKey) {
      const buses = mockDerbyBuses[matchedKey];
      const selectedBus = buses[0];
      const stops = mockRoutes[selectedBus.bus] || [];
      // Validate route has enough stops
      if (stops.length < 2) {
        const now = Date.now();
        if (!lastErrorTime || now - lastErrorTime > 5000) {
          setError('Invalid route: Not enough stops.');
          speak('Invalid route: Not enough stops.');
          setLastErrorTime(now);
        }
        return;
      }
      // Update transit info and selected route
      setTransitInfo(buses);
      setSelectedRoute({ bus: selectedBus.bus, destination: selectedBus.destination });
      setCurrentStopIndex(0);
      // Generate and speak a summary of the buses and stops
      const summary = buses
        .map((bus) => `Bus ${bus.bus} to ${bus.destination} at ${bus.time}`)
        .join('. ');
      const stopsText = stops.length > 0 ? ` Stops: ${stops.join(', ')}.` : '';
      speak(`${summary}.${stopsText}`);
      // Trigger vibration feedback
      navigator.vibrate?.([200, 100, 200]);
      // Close dialogs
      setShowRouteDialog(false);
      // Restart speech recognition if enabled
      if (browserSupportsSpeechRecognition && micEnabled) {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else {
      // Handle case where no buses are found
      const now = Date.now();
      if (!lastErrorTime || now - lastErrorTime > 5000) {
        setError('No buses found for this destination.');
        speak('No buses found for this destination.');
        setLastErrorTime(now);
      }
    }
  };

  // Handle destination selection and fetch transit data
  const handleDestinationSelect = (destination) => {
    speak(`Selected ${destination
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')}`);
    getTransitData(destination);
  };

  // Move to the next stop in the route
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
      // Move to the next stop
      const nextStop = stops[nextIndex];
      setCurrentStopIndex(nextIndex);
      setError('');
      speak(`Next stop: ${nextStop}.`);
      navigator.vibrate?.([200, 100, 200]);
    } else {
      // Handle reaching the final stop
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

  // Handle user indicating they’ve reached their destination
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
      // Confirm destination reached
      setError('');
      speak('You have reached your destination.');
      setQueryLog((prev) => [
        ...prev,
        {
          type: 'get_off',
          stop: stops[currentStopIndex],
          bus: selectedRoute.bus,
          destination: selectedRoute.destination,
          timestamp: new Date().toISOString(),
        },
      ]);
      setSelectedRoute(null);
      setCurrentStopIndex(0);
      setTransitInfo([]);
      setMicEnabled(false);
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      // Indicate destination not yet reached
      const now = Date.now();
      if (!lastErrorTime || now - lastErrorTime > 5000) {
        setError('You have not reached your destination yet.');
        speak('You have not reached your destination yet.');
        setLastErrorTime(now);
      }
    }
  };

  // Handle user getting off at the current stop
  const handleGetOff = () => {
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
    const currentStop = stops[currentStopIndex];
    setError('');
    speak(`You got off at ${currentStop}.`);
    setQueryLog((prev) => [
      ...prev,
      {
        type: 'get_off',
        stop: currentStop,
        bus: selectedRoute.bus,
        destination: selectedRoute.destination,
        timestamp: new Date().toISOString(),
      },
    ]);
    navigator.vibrate?.([200, 100, 200]);
    setSelectedRoute(null);
    setCurrentStopIndex(0);
    setTransitInfo([]);
    setMicEnabled(false);
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  // Exit the current route and reset state
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

  // Initiate transit data fetching and open route dialog
  const handleFetchTransit = () => {
    setShowRouteDialog(true);
    setMicEnabled(true);
    setError('');
    setLastErrorTime(null);
    speak('Select a destination, like Full Street, High Street, or New Beetwell Street.');
    if (browserSupportsSpeechRecognition) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  // Handle voice commands via speech recognition
  useEffect(() => {
    if (!transcript || !micEnabled || isProcessing) return;

    const command = transcript.toLowerCase().trim();
    console.log('Voice command:', command);
    if (showRouteDialog) {
      // Check if the command matches a destination or synonym when dialog is open
      const resolvedCommand = destinationSynonyms[command] || command;
      const matchedKey = Object.keys(mockDerbyBuses).find((key) =>
        resolvedCommand.includes(key) || key.includes(resolvedCommand)
      );
      if (matchedKey) {
        resetTranscript();
        handleDestinationSelect(matchedKey);
        return;
      }
    }
    if (command.includes('next bus')) {
      // Handle request for next bus to a destination
      const destinationMatch = command.match(/(?:to|for)\s+(.+)/);
      const destination = destinationMatch ? destinationMatch[1].trim() : 'unknown';
      if (destination && destination !== 'unknown') {
        resetTranscript();
        handleDestinationSelect(destination);
      } else {
        const now = Date.now();
        if (!lastErrorTime || now - lastErrorTime > 5000) {
          setError('Please specify a destination, like High Street.');
          speak('Please specify a destination, like High Street.');
          setLastErrorTime(now);
        }
        if (browserSupportsSpeechRecognition && micEnabled) {
          resetTranscript();
          SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
        }
      }
    } else if (command.includes('reached this stop') || command.includes('next stop')) {
      // Move to the next stop
      resetTranscript();
      getNextStop();
      if (browserSupportsSpeechRecognition && micEnabled) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else if (command.includes('i have reached my destination')) {
      // Confirm destination reached
      resetTranscript();
      handleDestinationReached();
      if (browserSupportsSpeechRecognition && micEnabled) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else if (
      command.includes('get off here') ||
      command.includes('stop here') ||
      command.includes('get off')
    ) {
      // Handle getting off at the current stop
      resetTranscript();
      handleGetOff();
      if (browserSupportsSpeechRecognition && micEnabled) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else if (
      command.includes('exit route') ||
      command.includes('exit this route') ||
      command.includes('exit the route') ||
      command.includes('i’m done')
    ) {
      // Exit the current route
      resetTranscript();
      exitRoute();
    } else if (command.includes('go back')) {
      // Close the route dialog
      resetTranscript();
      setShowRouteDialog(false);
      setError('');
      setLastErrorTime(null);
      speak('Route selection cancelled.');
      if (browserSupportsSpeechRecognition && micEnabled) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    }
  }, [transcript, showRouteDialog, selectedRoute, micEnabled, isProcessing, lastErrorTime]);

  // Stop speech recognition when no dialogs or routes are active
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    if (!showRouteDialog && !selectedRoute && listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  }, [showRouteDialog, selectedRoute, listening]);

  // Handle speech recognition errors
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
        if (micEnabled && (showRouteDialog || selectedRoute)) {
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
  }, [showRouteDialog, selectedRoute, micEnabled, lastErrorTime]);

  // Save query log to local storage
  useEffect(() => {
    if (queryLog.length > 0) {
      localStorage.setItem('queryLog', JSON.stringify(queryLog));
      console.log('Query Log:', queryLog);
    }
  }, [queryLog]);

  // Return state and functions for use in the App component
  return {
    transitInfo,
    selectedRoute,
    currentStopIndex,
    error,
    micEnabled,
    showRouteDialog,
    handleFetchTransit,
    exitRoute,
    handleGetOff,
    getNextStop,
    setShowRouteDialog,
    setMicEnabled,
    handleDestinationSelect,
  };
};

export default useTransit;