import { gql } from "graphql-request";

export const getNotice = gql`
query getNotice {
    notices {
      noticeId
    }
  }
`