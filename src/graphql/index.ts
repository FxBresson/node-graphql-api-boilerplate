import { schemaComposer } from 'graphql-compose';
import { ExampleTC } from '../models/type-composers';

schemaComposer.Query.addFields({
  exampleById: ExampleTC.getResolver('findById'),
  exampleByIds: ExampleTC.getResolver('findByIds'),
  exampleOne: ExampleTC.getResolver('findOne'),
  exampleMany: ExampleTC.getResolver('findMany'),
});

schemaComposer.Mutation.addFields({
  exampleCreateOne: ExampleTC.getResolver('createOne'),
  exampleCreateMany: ExampleTC.getResolver('createMany'),
  exampleUpdateById: ExampleTC.getResolver('updateById'),
  exampleUpdateOne: ExampleTC.getResolver('updateOne'),
  exampleUpdateMany: ExampleTC.getResolver('updateMany'),
  exampleRemoveById: ExampleTC.getResolver('removeById'),
  exampleRemoveOne: ExampleTC.getResolver('removeOne'),
  exampleRemoveMany: ExampleTC.getResolver('removeMany'),
});

const graphqlSchema = schemaComposer.buildSchema();
export { graphqlSchema };