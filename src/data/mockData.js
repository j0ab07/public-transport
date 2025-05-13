// Mock data for bus schedules, mapping destinations to bus details
export const mockDerbyBuses = {
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

// Mock data for bus routes, mapping bus numbers to their stops
export const mockRoutes = {
  '1A': ['Morledge', 'Derwent Street', 'Pride Park', 'Alvaston'],
  '1C': ['Morledge', 'Victoria Street', 'City Centre', 'Pride Park'],
  'i4': ['Morledge', 'Midland Road', 'Derby Station', 'Osmaston Road'],
  'V1': ['Morledge', 'Albert Street', 'City Centre', 'Burton Road'],
  '6.1': ['Morledge', 'Victoria Street', 'City Centre', 'Allestree'],
  '2A': ['Morledge', 'London Road', 'Osmaston Road', 'Chellaston'],
};