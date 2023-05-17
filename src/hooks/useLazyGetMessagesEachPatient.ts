import { useState } from 'react';
import { useStore } from '../store';
import { useLazyQuery } from '@apollo/client';
import { GET_MESSAGES_EACH_PATIENT_DOCUMENT } from '../graphql';
import type { messagesEachPatient } from '../types/processedGeneratedTypes';
import type { TwoDate } from '../types/commonTypes';
import type {
  GetMessagesEachPatientQuery,
  GetMessagesEachPatientQueryVariables,
} from '../types/generatedTypes';

export const useLazyGetMessagesEachPatient = () => {
  const clinicId = useStore((state) => state.pickedClinicId);
  const [patients, setPatients] = useState<messagesEachPatient[]>();
  const [page, setPage] = useState(1);
  const [take, setTake] = useState<number>();

  const [callQuery, { loading, data, variables, fetchMore: _fetchMore }] =
    useLazyQuery<
      GetMessagesEachPatientQuery,
      GetMessagesEachPatientQueryVariables
    >(GET_MESSAGES_EACH_PATIENT_DOCUMENT);

  const getMessagesEachPatient = (dates: TwoDate) => {
    let _TAKE;
    if (dates[1].valueOf() - dates[0].valueOf() > 86400000) {
      _TAKE = 20;
      setTake(_TAKE);
    }
    callQuery({
      variables: { input: { clinicId, dates, page, take: _TAKE } },
      onCompleted(data) {
        const { results } = data.getMessagesEachPatient;
        setPatients(results || []);
      },
      fetchPolicy: 'network-only',
    });
  };

  const fetchMore = () => {
    if (loading || !data?.getMessagesEachPatient.hasMore) return;
    let newPage = page + 1;
    _fetchMore({
      variables: { input: { ...variables?.input, page: newPage, take } },
      updateQuery: (prevResults, { fetchMoreResult, variables }) => {
        if (!fetchMoreResult?.getMessagesEachPatient.results)
          return prevResults;
        const prevMessage = prevResults?.getMessagesEachPatient.results || [];
        const newMessage =
          fetchMoreResult?.getMessagesEachPatient.results || [];
        const newResult = structuredClone(fetchMoreResult);
        newResult.getMessagesEachPatient.results = [
          ...prevMessage,
          ...newMessage,
        ];
        return newResult;
      },
    });
    setPage(newPage);
  };

  const hasMorePage = !!data?.getMessagesEachPatient.hasMore;

  return { patients, hasMorePage, getMessagesEachPatient, fetchMore };
};
