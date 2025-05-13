// Utility function for text-to-speech functionality
export const speak = (text) => {
  // Log the text being spoken
  console.log('Speaking:', text);
  // Create a new speech utterance
  const utterance = new SpeechSynthesisUtterance(text);
  // Set language to US English
  utterance.lang = 'en-US';
  // Log when speech ends
  utterance.onend = () => console.log('Speech ended:', text);
  // Log any speech errors
  utterance.onerror = (e) => console.error('Speech error:', e);
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  // Speak the utterance
  window.speechSynthesis.speak(utterance);
};