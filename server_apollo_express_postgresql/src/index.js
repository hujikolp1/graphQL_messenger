import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import express from 'express';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import loaders from './loaders';

const app = express();

app.use(cors());

app.use(morgan('dev'));

const getMe = async (request) => {
  const token = request.headers['x-token'];

  if (token) {
    // may require clearing history
    // or clearing current jwt token 
    // or else it could produce an Authentication Error from the old token 
    try {
      return await jwt.verify(token, process.env.SECRET);
    } 
    catch (e) {
      throw new AuthenticationError( e );
    }
  }
  else {
    // clear token
    // regenerate token 
  }
};

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  // context function parameters: 
  // HTTP comes with 'req' and 'res'
  // Subscriptions come with a 'connection'
  context: async ({ req, connection }) => {
    // Subscription
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }
    // HTTP
    if (req) {
      const me = await getMe(req);

      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: { // improved queries by removing redundancy with DataLoader 
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE; // !! converts to boolean 
const isProduction = !!process.env.DATABASE_URL;
const port = process.env.PORT || 8000;

sequelize.sync({ force: isTest || isProduction }).then(async () => {
  if (isTest || isProduction) {
    createUsersWithMessages(new Date());
  }

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: 'harold',
      email: 'harold@harold.com',
      password: 'harold',
      role: 'ADMIN',
      messages: [
        {
          text: 'Working on GraphQL React App',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
  // add any other users below by following the models above 
};
