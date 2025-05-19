import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { styles } from '../styles/AppStyles';

// Component to display the log of past routes and actions
const LogsDialog = ({ open, onClose, queryLog, highContrast, clearLogs }) => {
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const readLogs = () => {
    if (queryLog.length === 0) {
      speak('No logs available yet.');
      return;
    }
    const logText = queryLog.map((log, index) => {
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
  };

  return (
    <Dialog
      fullScreen={{ xs: true, sm: false }}
      open={open}
      onClose={onClose}
      aria-labelledby="logs-dialog-title"
      maxWidth="md"
      sx={{ '& .MuiDialog-paper': { backgroundColor: highContrast ? '#fff' : '#1a1a1a' } }}
    >
      <DialogTitle id="logs-dialog-title" sx={{ color: highContrast ? '#000' : '#fff' }}>
        Route Logs
      </DialogTitle>
      <DialogContent>
        {queryLog.length === 0 ? (
          <Typography sx={{ color: highContrast ? '#000' : '#fff', fontSize: { xs: '1rem', md: '1.125rem' } }}>
            No logs available yet.
          </Typography>
        ) : (
          <List>
            {queryLog.map((log, index) => (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: highContrast ? '#eee' : '#222',
                  margin: { xs: '0.5rem 0', md: '0.75rem 0' },
                  borderRadius: '8px',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Typography
                  sx={{
                    color: highContrast ? '#000' : '#fff',
                    fontSize: { xs: '1rem', md: '1.125rem' },
                  }}
                >
                  <strong>Selected Destination:</strong> {log.destination} (Bus {log.bus})
                </Typography>
                {log.gotOffAt && (
                  <Typography
                    sx={{
                      color: highContrast ? '#000' : '#fff',
                      fontSize: { xs: '1rem', md: '1.125rem' },
                    }}
                  >
                    <strong>Got off at:</strong> {log.gotOffAt}
                  </Typography>
                )}
                <Typography
                  sx={{
                    color: highContrast ? '#333' : '#ccc',
                    fontSize: { xs: '0.875rem', md: '1rem' },
                  }}
                >
                  <strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}
                </Typography>
                {log.stopsTaken && log.stopsTaken.length > 0 && (
                  <Box sx={{ mt: 1, pl: 2 }}>
                    <Typography
                      sx={{
                        color: highContrast ? '#000' : '#fff',
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        fontWeight: 'bold',
                      }}
                    >
                      Stops Taken:
                    </Typography>
                    <List dense>
                      {log.stopsTaken.map((stop, stopIndex) => (
                        <ListItem key={stopIndex} sx={{ py: 0 }}>
                          <ListItemText
                            primary={`${stopIndex + 1}. ${stop}`}
                            primaryTypographyProps={{
                              color: highContrast ? '#000' : '#fff',
                              fontSize: { xs: '0.875rem', md: '1rem' },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                {log.fullRoute && (
                  <Box sx={{ mt: 1, pl: 2 }}>
                    <Typography
                      sx={{
                        color: highContrast ? '#000' : '#fff',
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        fontWeight: 'bold',
                      }}
                    >
                      Full Route:
                    </Typography>
                    <List dense>
                      {log.fullRoute.map((stop, stopIndex) => (
                        <ListItem key={stopIndex} sx={{ py: 0 }}>
                          <ListItemText
                            primary={`${stopIndex + 1}. ${stop}`}
                            primaryTypographyProps={{
                              color: highContrast ? '#000' : '#fff',
                              fontSize: { xs: '0.875rem', md: '1rem' },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        {queryLog.length > 0 && (
          <>
            <Button
              onClick={readLogs}
              sx={{
                color: highContrast ? '#000' : '#007AFF',
                fontSize: { xs: '1rem', md: '1.125rem' },
                padding: '0.75rem 1.5rem',
              }}
              aria-label="Read logs aloud"
            >
              Read Logs
            </Button>
            <Button
              onClick={() => {
                clearLogs();
                onClose();
              }}
              sx={{
                color: highContrast ? '#d00' : '#ff4444',
                fontSize: { xs: '1rem', md: '1.125rem' },
                padding: '0.75rem 1.5rem',
              }}
              aria-label="Clear logs"
            >
              Clear Logs
            </Button>
          </>
        )}
        <Button
          onClick={onClose}
          sx={{
            color: highContrast ? '#000' : '#007AFF',
            fontSize: { xs: '1rem', md: '1.125rem' },
            padding: '0.75rem 1.5rem',
          }}
          aria-label="Close logs dialog"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogsDialog;