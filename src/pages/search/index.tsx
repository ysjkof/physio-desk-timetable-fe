import { useReactiveVar } from '@apollo/client';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import Worning from '../../components/atoms/Warning';
import SearchedPatientLi from './organisms/SearchedPatientLi';
import { useSearchPatientLazyQuery } from '../../graphql/generated/graphql';
import { selectedInfoVar } from '../../store';
import { MUOOL } from '../../constants/constants';

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [callQuery, { loading, data }] = useSearchPatientLazyQuery();
  const selectedInfo = useReactiveVar(selectedInfoVar);

  const onClick = (patientId: number) => {
    navigate('/patient', {
      state: { todo: 'viewPatientInfoDetail', patientId },
    });
  };
  useEffect(() => {
    const { search } = location;
    const [_, queryName] = search.split('?name=');
    if (!queryName) {
      return navigate(-1);
    }
    callQuery({
      variables: {
        input: {
          page: 1,
          query: decodeURI(queryName),
          clinicId: selectedInfo.clinic!.id,
        },
      },
    });
  }, [location]);

  return (
    <>
      <Helmet>
        <title>검색 | {MUOOL}</title>
      </Helmet>
      {loading && <p>loading ...</p>}
      {!loading && data?.searchPatient.patients?.length === 0 ? (
        <Worning type="emptySearch" />
      ) : (
        <div className="container mx-auto divide-y">
          <h1 className="font-bold">검색 결과</h1>
          {data?.searchPatient.patients?.map((patient) => (
            <SearchedPatientLi
              key={patient.id}
              id={patient.id}
              gender={patient.gender}
              name={patient.name}
              registrationNumber={patient.registrationNumber}
              birthday={patient.birthday}
            />
          ))}
        </div>
      )}
    </>
  );
}
