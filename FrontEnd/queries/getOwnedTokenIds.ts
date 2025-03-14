import { gql } from "graphql-request";

const GET_OWNED_TOKEN_IDS = gql`
  query GetOwnedTokenIds($owner: Bytes!, $contract: Bytes!) {
    tokens(where: { owner: $owner, contract: $contract }) {
      tokenId
      tokenURI
    }
  }
`;

export default GET_OWNED_TOKEN_IDS;