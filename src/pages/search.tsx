import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { NameTag } from "../components/name-tag";
import { Patient } from "../components/patient";
import { useSearchPatientByNameLazyQuery } from "../graphql/generated/graphql";

export const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [callQuery, { loading, data }] = useSearchPatientByNameLazyQuery();
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
      <h1 className="text-lg font-bold">검색 PAGE</h1>
      {loading && <p>loading ...</p>}
      {!loading && data?.searchPatientByName.patients?.length === 0 ? (
        <div className="container py-20 px-10">
          <p>검색결과가 없습니다</p>
        </div>
      ) : (
        <div className="container py-20 px-10">
          {data?.searchPatientByName.patients?.map((patient) => (
            <NameTag
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
};
