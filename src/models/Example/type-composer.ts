import { composeWithMongoose } from 'graphql-compose-mongoose/node8'

import { Example } from './index'

const ExampleTC = composeWithMongoose(Example);

export { ExampleTC }