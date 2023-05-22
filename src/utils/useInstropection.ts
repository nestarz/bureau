import { useQuery, gql } from "./useHttp.ts";

interface TypeFields {
  name: string;
  type: {
    name?: string;
    kind: string;
  };
}

interface TypeData {
  data: {
    __type: {
      name: string;
      kind: string;
      fields: TypeFields[];
    };
  };
}

export const useTypeFieldsQuery = (typeName: string): TypeData =>
  useQuery(
    gql`
      query getTypeFields($typeName: String!) {
        __type(name: $typeName) {
          name
          kind
          fields {
            name
            type {
              name
              kind
            }
          }
        }
      }
    `,
    { variables: { typeName } }
  );
