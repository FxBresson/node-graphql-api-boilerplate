import express from 'express';
import graphlHTTP from 'express-graphql';

import { graphqlSchema } from '../graphql';

const mainRouter = express.Router();

mainRouter.use('/graphql', graphlHTTP((req, res, graphQLParams) => ({
  schema: graphqlSchema,
  graphiql: true,
})));

mainRouter.get('/', (req, res) => {
  return res.json('Test');
  return res.status(400);
});

export default mainRouter
