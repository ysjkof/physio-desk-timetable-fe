import { Fragment, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchName } from "../../components/search-name";
import { useSearchPatientLazyQuery } from "../../graphql/generated/graphql";

export const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [callQuery, { loading, data }] = useSearchPatientLazyQuery();

  const onClick = (patientId: number) => {
    navigate("/patient", {
      state: { todo: "viewPatientInfoDetail", patientId },
    });
  };
  useEffect(() => {
    const { search } = location;
    const [_, queryName] = search.split("?name=");
    if (!queryName) {
      return navigate(-1);
    }
    callQuery({
      variables: { input: { page: 1, query: decodeURI(queryName) } },
    });
  }, [location]);

  return (
    <>
      <Helmet>
        <title>검색 | Muool</title>
      </Helmet>
      {loading && <p>loading ...</p>}
      {!loading && data?.searchPatient.patients?.length === 0 ? (
        <div className="container py-20 px-10">
          <p>검색결과가 없습니다</p>
        </div>
      ) : (
        <div className="container mx-auto divide-y">
          <h1 className="font-bold">검색 결과</h1>
          {data?.searchPatient.patients?.map((patient) => (
            <Fragment key={patient.id}>
              <SearchName
                id={patient.id}
                gender={patient.gender}
                name={patient.name}
                registrationNumber={patient.registrationNumber}
                birthday={patient.birthday}
                onClick={() => onClick(patient.id)}
              />
              {patient.clinic ? patient.clinic.name : "---"}
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
};
