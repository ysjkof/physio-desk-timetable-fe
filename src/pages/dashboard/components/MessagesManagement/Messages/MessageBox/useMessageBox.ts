import { useEffect, useRef, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_MESSAGES_BY_PATIENT_DOCUMENT } from '../../../../../../graphql';
import type {
  GetMessagesByPatientQuery,
  GetMessagesByPatientQueryVariables,
} from '../../../../../../types/generatedTypes';
import type { messagesWithContentByPatient } from '../../../../../../types/processedGeneratedTypes';

interface UseMessageBoxProps {
  patientId: number | undefined;
  isNewMessage: boolean;
}

export const useMessageBox = ({
  patientId,
  isNewMessage,
}: UseMessageBoxProps) => {
  const [messages, setMessages] = useState<messagesWithContentByPatient>();
  const [page, setPage] = useState(1);
  const [prevPatientId, setPrevPatientId] = useState(patientId);
  const ulRef = useRef<HTMLUListElement>(null);

  const [callQuery, { data, loading, fetchMore: _fetchMore }] = useLazyQuery<
    GetMessagesByPatientQuery,
    GetMessagesByPatientQueryVariables
  >(GET_MESSAGES_BY_PATIENT_DOCUMENT, { fetchPolicy: 'network-only' });

  const clearAll = () => {
    setMessages(undefined);
    setPage(1);
    setPrevPatientId(patientId);
  };

  const fetchMore = () => {
    if (loading || !data?.getMessagesByPatient.results?.hasMore) return;
    let newPage = page + 1;
    if (!patientId) throw new Error('patientId is undefined');
    _fetchMore({
      variables: { input: { patientId, page: newPage } },
      updateQuery: (prevResults, { fetchMoreResult, variables }) => {
        const prevMessage =
          prevResults.getMessagesByPatient.results?.messages || [];
        const newMessage =
          fetchMoreResult.getMessagesByPatient.results?.messages || [];
        const newResult = structuredClone(fetchMoreResult);
        if (!newResult.getMessagesByPatient.results) return prevResults;
        newResult.getMessagesByPatient.results.messages = [
          ...newMessage,
          ...prevMessage,
        ];
        return newResult;
      },
    });
    setPage(newPage);
  };

  useEffect(() => {
    if (!prevPatientId || prevPatientId !== patientId) return clearAll();
    if (!patientId) return clearAll();
    callQuery({ variables: { input: { patientId, page } } });
    return () => clearAll();
  }, [patientId, prevPatientId]);

  useEffect(() => {
    if (!data?.getMessagesByPatient.results?.messages && !patientId) return;
    setMessages(data?.getMessagesByPatient.results?.messages);
  }, [data]);

  useEffect(() => {
    if (page !== 1) return;
    ulRef.current?.scrollTo({ top: ulRef?.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!isNewMessage) return;
    clearAll();
  }, [isNewMessage]);

  return {
    messages,
    ulRef,
    hasMore: patientId && data?.getMessagesByPatient.results?.hasMore,
    loading,
    fetchMore,
    clearAll,
  };
};
