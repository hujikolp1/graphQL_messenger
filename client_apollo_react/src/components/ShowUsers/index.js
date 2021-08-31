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
      {session && session.me && <div> All Users Here </div>}
    </div>

    <Query
      query={GET_ALL_USERS}
    > 
      {({ data, loading, error, fetchMore }) => {

        console.log('DATA: ', data.users)
        if (!data) {
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
              {/* {data.users[1].username} */}
              {data.users.map(i => {
                return <li>{i.username}</li>
              })}
            </div>
            
          );
        }
      }}
    </Query>


  </div>
);

export default withSession(ShowUsers);