const pointTypeToPretext = {
  'taxi': `Taxi to`,
  'bus': `Bus to`,
  'train': `Train to`,
  'ship': `Ship to`,
  'transport': `Transport to`,
  'drive': `Drive to`,
  'flight': `Flight to`,
  'check-in': `Check in`,
  'sightseeing': `Sightseeing in`,
  'restaurant': `Restaurant in`,
};

const GROUP_ACTIVITY_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const GROUP_TRANSFER_TYPES = [`check-in`, `sightseeing`, `restaurant`];
const OfferList = {
  'luggage': {
    text: `Add luggage`,
    price: 30,
  },
  'comfort': {
    text: `Switch to comfort class`,
    price: 100,
  },
  'meal': {
    text: `Add meal`,
    price: 15,
  },
  'seats': {
    text: `Choose seats`,
    price: 5,
  },
  'train': {
    text: `Travel by train`,
    price: 40,
  }
};

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

export {
  pointTypeToPretext,
  GROUP_ACTIVITY_TYPES,
  GROUP_TRANSFER_TYPES,
  OfferList,
  SortType
};
