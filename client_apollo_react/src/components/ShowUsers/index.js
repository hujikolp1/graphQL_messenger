import React from 'react';
import withSession from '../Session/withSession';

const ShowUsers = ({ session }) => (
  <div>

    <div>
      <h2>Other Users</h2>
      {session && session.me && <div> All Users Here </div>}
    </div>

  </div>
);

export default withSession(ShowUsers);