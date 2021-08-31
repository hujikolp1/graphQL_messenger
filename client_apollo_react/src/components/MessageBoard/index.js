import React from 'react';
import withSession from '../Session/withSession';
import { MessageCreate, Messages } from '../Message';
import ShowUsers from '../ShowUsers'; 

const rowStyles = {
  display: 'flex',
};
const columnStyles = {
  flex: '50%',
};

const MessageBoard = ({ session }) => (
  <div style={rowStyles}>

    <div style={columnStyles}>
      <h2>Message Board</h2>
      {session && session.me && <MessageCreate/>}
      <Messages limit={5} />
    </div>
    <div style={columnStyles}>
      <ShowUsers/>  
    </div>

  </div>
);

export default withSession(MessageBoard);
