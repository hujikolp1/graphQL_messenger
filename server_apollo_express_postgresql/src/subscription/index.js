import { PubSub } from 'apollo-server';

import * as MESSAGE_EVENTS from './message';

// Allows publishing and subscribing to events 

export const EVENTS = {
  MESSAGE: MESSAGE_EVENTS,
};

export default new PubSub();
