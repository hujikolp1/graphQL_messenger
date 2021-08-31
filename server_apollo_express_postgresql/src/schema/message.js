import { gql } from 'apollo-server-express';

// use Date type defined in schema (instead of using String)

// messages(offset: Int, limit: Int): [Message!]!
// Note about offsets: 
// Offsets can become innaccurate if not updated
// For example, after an item is deleted, the item count decreases by one
// the static offset will not be inaccurate 

// Subscription is similar to Query but emits data changes in real time 

export default gql`

  extend type Query {
    messages(cursor: String, limit: Int): MessageConnection!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Message {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }

  extend type Subscription {
    messageCreated: MessageCreated!
  }

  type MessageCreated {
    message: Message!
  }
`;
