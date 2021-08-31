import React from 'react';

import withAuthorization from '../Session/withAuthorization';

const DirectMessages = () => (
  <div>
    <h1>Direct Messages</h1>
  </div>
);

export default withAuthorization(session => session && session.me)(
    DirectMessages,
);
