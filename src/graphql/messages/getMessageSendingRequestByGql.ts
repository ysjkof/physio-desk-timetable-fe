import { gql } from '@apollo/client';

export const GET_SENDING_RESULT_FROM_NCP_BY_REQUEST_TIME_DOCUMENT = gql`
  query getSendingResultFromNCPByRequestTime(
    $input: GetSendingResultFromNCPByRequestTimeInput!
  ) {
    getSendingResultFromNCPByRequestTime(input: $input) {
      ok
      error
      response {
        messages {
          requestId
          messageId
          requestTime
          contentType
          type
          countryCode
          from
          to
          completeTime
          telcoCode
          status
          statusCode
          statusName
          statusMessage
        }
        statusCode
        statusName
        pageIndex
        pageSize
        itemCount
        hasMore
      }
    }
  }
`;
