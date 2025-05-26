import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { mockDerbyBuses, mockRoutes } from '../data/mockData';
import { speak } from '../utils/speech';

// Custom hook to manage transit-related state and logic
const useTransit = () => {
  // State for transit data, route, and UI controls
  const [transitInfo, setTransitInfo] = useState([]); // Array of available buses
  const [selectedRoute, setSelectedRoute] = useState(null); // Currently selected route
  const [micEnabled, setMicEnabled] = useState(false); // Flag for voice input status
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition(); // Speech recognition data
  const [error, setError] = useState(''); // Error messages for UI
  const [queryLog, setQueryLog] = useState([]); // Log of journey queries
  const [currentStopIndex, setCurrentStopIndex] = useState(0); // Current stop index in route
  const [visitedStops, setVisitedStops] = useState([]); // Stops visited in journey
  const [showRouteDialog, setShowRouteDialog] = useState(false); // Flag for route dialog visibility
  const [lastErrorTime, setLastErrorTime] = useState(null); // Timestamp of last error
  const [isProcessing, setIsProcessing] = useState(false); // Flag to prevent concurrent actions
  const [currentJourneyId, setCurrentJourneyId] = useState(null); // Unique ID for current journey

  // Mapping of destination synonyms for voice input flexibility
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

  // Generates a unique journey ID
  const generateJourneyId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Fetches transit data based on destination input
  const getTransitData = (destination) => {
    const destinationLower = destination.toLowerCase().trim();
    const resolvedDestination = destinationSynonyms[destinationLower] || destinationLower;
    const matchedKey = Object.keys(mockDerbyBuses).find((key) =>
      resolvedDestination.includes(key) || key.includes(resolvedDestination)
    );

    if (matchedKey) {
      const buses = mockDerbyBuses[matchedKey];
      const selectedBus = buses[0];
      const stops = mockRoutes[selectedBus.bus] || [];
      if (stops.length < 2) {
        const now = Date.now();
        if (!lastErrorTime || now - lastErrorTime > 5000) {
          setError('Invalid route: Not enough stops.');
          speak('Invalid route: Not enough stops. Please try a different destination.');
          setLastErrorTime(now);
        }
        return;
      }
      setTransitInfo(buses);
      setSelectedRoute({ bus: selectedBus.bus, destination: selectedBus.destination });
      setCurrentStopIndex(0);
      setVisitedStops([stops[0].name]);
      const journeyId = generateJourneyId();
      setCurrentJourneyId(journeyId);
      setQueryLog((prev) => [
        ...prev,
        {
          journeyId,
          destination,
          bus: selectedBus.bus,
          fullRoute: stops.map(stop => stop.name),
          stopsTaken: [stops[0].name],
          timestamp: new Date().toISOString(),
        },
      ]);
      // Announce bus details and stops
      const summary = buses
        .map((bus) => `Bus ${bus.bus} to ${bus.destination} at ${bus.time}`)
        .join('. ');
      const stopsText = stops.length > 0 ? ` Stops: ${stops.map(stop => stop.name).join(', ')}.` : '';
      speak(`${summary}.${stopsText}`);
      navigator.vibrate?.([200, 100, 200]);
      setShowRouteDialog(false);
      if (browserSupportsSpeechRecognition && micEnabled) {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else {
      const now = Date.now();
      if (!lastErrorTime || now - lastErrorTime > 5000) {
        setError('No buses found for this destination.');
        speak('No buses found for this destination. Try saying a destination like Full Street or High Street.');
        setLastErrorTime(now);
      }
    }
  };

  // Handles destination selection with speech announcement
  const handleDestinationSelect = (destination) => {
    speak(`Selected ${destination
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')}`);
    getTransitData(destination);
  };

  // Advances to the next stop in the route
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
      setVisitedStops((prev) => [...prev, nextStop.name]);
      setQueryLog((prev) =>
        prev.map((entry) =>
          entry.journeyId === currentJourneyId
            ? { ...entry, stopsTaken: [...entry.stopsTaken, nextStop.name] }
            : entry
        )
      );
      setError('');
      speak(`Next stop: ${nextStop.name}.`);
      navigator.vibrate?.([200, 100, 200]);
    } else {
      setError('You’ve reached the final stop.');
      speak('You’ve reached the final stop.');
      setQueryLog((prev) =>
        prev.map((entry) =>
          entry.journeyId === currentJourneyId
            ? { ...entry, gotOffAt: stops[currentStopIndex].name, stopsTaken: visitedStops }
            : entry
        )
      );
      setCurrentJourneyId(null);
      setVisitedStops([]);
      setSelectedRoute(null);
      setCurrentStopIndex(0);
      setTransitInfo([]);
      setMicEnabled(false);
      SpeechRecognition.stopListening();
      resetTranscript();
    }
    setIsProcessing(false);
  };

  // Verifies if the user has reached their destination
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
      setQueryLog((prev) =>
        prev.map((entry) =>
          entry.journeyId === currentJourneyId
            ? { ...entry, gotOffAt: stops[currentStopIndex].name, stopsTaken: visitedStops }
            : entry
        )
      );
      setCurrentJourneyId(null);
      setVisitedStops([]);
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

  // Handles user getting off at the current stop
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
    speak(`You got off at ${currentStop.name}.`);
    setQueryLog((prev) =>
      prev.map((entry) =>
        entry.journeyId === currentJourneyId
          ? { ...entry, gotOffAt: currentStop.name, stopsTaken: visitedStops }
          : entry
      )
    );
    navigator.vibrate?.([200, 100, 200]);
    setCurrentJourneyId(null);
    setVisitedStops([]);
    setSelectedRoute(null);
    setCurrentStopIndex(0);
    setTransitInfo([]);
    setMicEnabled(false);
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  // Exits the current route and resets state
  const exitRoute = () => {
    setSelectedRoute(null);
    setCurrentStopIndex(0);
    setVisitedStops([]);
    setCurrentJourneyId(null);
    setTransitInfo([]);
    setError('');
    setMicEnabled(false);
    SpeechRecognition.stopListening();
    resetTranscript();
    speak('Route exited. Choose a new destination.');
    navigator.vibrate?.([200, 100, 200]);
  };

  // Initiates transit data fetch and voice input
  const handleFetchTransit = () => {
    setShowRouteDialog(true);
    setMicEnabled(true);
    setError('');
    setLastErrorTime(null);
    speak('Select a destination, like Full Street, High Street, or New Beetwell Street, or say go back to cancel.');
    if (browserSupportsSpeechRecognition) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  // Clears journey logs from state and storage
  const clearLogs = () => {
    setQueryLog([]);
    localStorage.removeItem('queryLog');
    speak('Logs cleared.');
    navigator.vibrate?.([200, 100, 200]);
  };

  // Effect for periodic proximity alerts
  useEffect(() => {
    if (!selectedRoute || !mockRoutes[selectedRoute.bus]) return;
    const stops = mockRoutes[selectedRoute.bus];
    const interval = setInterval(() => {
      // Placeholder for proximity alerts
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedRoute, currentStopIndex]);

  // Effect to handle voice command processing
  useEffect(() => {
    if (!transcript || !micEnabled || isProcessing) return;
    const command = transcript.toLowerCase().trim();
    console.log('Voice command:', command);
    if (showRouteDialog) {
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
      command.includes('get off here') ||
      command.includes('stop here') ||
      command.includes('get off')
    ) {
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
      resetTranscript();
      exitRoute();
    } else if (command.includes('go back')) {
      resetTranscript();
      setShowRouteDialog(false);
      setError('');
      setLastErrorTime(null);
      speak('Route selection cancelled.');
      if (browserSupportsSpeechRecognition && micEnabled) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else if (command.includes('read logs')) {
      resetTranscript();
      const logText = queryLog.length === 0
        ? 'No logs available yet.'
        : queryLog.map((log, index) => {
            let text = `Journey ${index + 1}. Selected destination: ${log.destination}, Bus ${log.bus}. `;
            if (log.gotOffAt) {
              text += `Got off at ${log.gotOffAt}. `;
            }
            text += `Timestamp: ${new Date(log.timestamp).toLocaleString()}. `;
            if (log.stopsTaken && log.stopsTaken.length > 0) {
              text += `Stops taken: ${log.stopsTaken.join(', ')}. `;
            }
            if (log.fullRoute) {
              text += `Full route: ${log.fullRoute.join(', ')}.`;
            }
            return text;
          }).join(' ');
      speak(logText);
      if (browserSupportsSpeechRecognition && micEnabled) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else if (command.includes('clear logs')) {
      resetTranscript();
      clearLogs();
      if (browserSupportsSpeechRecognition && micEnabled) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else if (command.includes('what time is it') || command.includes('tell me the time')) {
      resetTranscript();
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });
      speak(`The time is ${timeString}.`);
      if (browserSupportsSpeechRecognition && micEnabled) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    } else if (command.includes('help') || command.includes('what can i say')) {
      resetTranscript();
      speak('Here are the available commands: Say "next bus to" followed by a destination to select a route, like "next bus to Full Street". Say "next stop" to move to the next stop. Say "get off here" to get off at the current stop. Say "exit route" to end the journey. Say "what time is it" to hear the current time. Say "read logs" to hear your journey logs. Say "clear logs" to clear your logs. Say "help" to hear this message again.');
      if (browserSupportsSpeechRecognition && micEnabled) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      }
    }
  }, [transcript, showRouteDialog, selectedRoute, micEnabled, isProcessing, lastErrorTime]);

  // Effect to stop listening when no route or dialog is active
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;
    if (!showRouteDialog && !selectedRoute && listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  }, [showRouteDialog, selectedRoute, listening]);

  // Effect to handle speech recognition errors
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

  // Effect to save query log to local storage
  useEffect(() => {
    if (queryLog.length > 0) {
      localStorage.setItem('queryLog', JSON.stringify(queryLog));
      console.log('Query Log:', queryLog);
    }
  }, [queryLog]);

  // Return state and functions for use in App component
  return {
    transitInfo,
    selectedRoute,
    currentStopIndex,
    error,
    micEnabled,
    showRouteDialog,
    queryLog,
    handleFetchTransit,
    exitRoute,
    handleGetOff,
    getNextStop,
    setShowRouteDialog,
    setMicEnabled,
    handleDestinationSelect,
    clearLogs,
  };
};

export default useTransit;