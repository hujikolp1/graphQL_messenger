import React from 'react';
import withSession from '../Session/withSession';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const GET_ALL_USERS = gql`
  {
    users {
      username
      id
      email
      role
    } 
  }
`; 

const ShowUsers = ({ session }) => (
  <div>

    <div>
      <h2>Other Users</h2>
      {session && session.me && <div>  </div>}
    </div>

    <Query
      query={GET_ALL_USERS}
    > 
      {({ data, loading, error, fetchMore }) => {

        if (!data.users) {
          return (
            <div>
              There are no users ...
            </div>
          );
        }
        if (loading) {
          return (
            <div>
              Working on it ...
            </div>
          );
        }
        if (error) {
          return (
            <div>
              Error broke my page ...
            </div>
          );
        }
        if (data) {    
          return (
            <div>
              {data.users.map(i => {
                if(session.me && (session.me.id !== i.id)) {
                  return (
                    <div style={{border:'1px solid black',marginBottom:'7px'}}>
                      <div>Username: <span style={{fontWeight:'bold'}}>{i.username}</span></div>
                      <div>Email: {i.email}</div>
                      <div>Avatar :) </div>
                      <div>Online?</div> 
                      <div>Direct Message? <button>Open</button></div>
                    </div>
                  )
                }
              })}
            </div>
            
          );
        }
      }}
    </Query>


  </div>
);

export default withSession(ShowUsers);