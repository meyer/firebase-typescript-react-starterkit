import { GraphQLScalarLiteralParser, GraphQLScalarType, Kind } from 'graphql';

const parseValue = (value: any) => value;

const parseObject: GraphQLScalarLiteralParser<any> = (ast, vars) => {
  if (ast.kind !== Kind.OBJECT) {
    throw new Error('nope');
  }
  const value = Object.create(null);
  ast.fields.forEach(field => {
    value[field.name.value] = parseLiteral(field.value, vars);
  });

  return value;
};

const parseLiteral: GraphQLScalarLiteralParser<any> = (ast, vars) => {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(ast, vars);
    case Kind.LIST:
      return ast.values.map(n => parseLiteral(n, vars));
    case Kind.NULL:
      return null;
    case Kind.VARIABLE: {
      const name = ast.name.value;
      return vars ? vars[name] : undefined;
    }
    default:
      return undefined;
  }
};

export const AnyScalarType = new GraphQLScalarType({
  name: 'Any',
  description: 'The equivalent to TypeScript\'s "any" type',
  serialize: parseValue,
  parseValue,
  parseLiteral,
});
