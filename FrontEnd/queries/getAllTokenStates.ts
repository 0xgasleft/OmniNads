import { gql } from "graphql-request";

const GET_ALL_TOKEN_STATES = gql`
  query GetAllTokenStates($contract: Bytes!) {
    tokens(where: { contract: $contract }) {
      tokenId
      tokenURI
      tokenState
    }
  }
`;

export default GET_ALL_TOKEN_STATES;