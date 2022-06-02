import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useFindPatientByIdQuery } from "../../graphql/generated/graphql";

export const PateintDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { todo, patientId } = location.state as {
    todo: string;
    patientId: number;
  };
  if (todo !== "viewPatientInfoDetail") {
    navigate(-1);
  }

  const { data } = useFindPatientByIdQuery({
    variables: { input: { patientId } },
  });
  const patient = data?.findPatientById.patient;

  return (
    <>
      <Helmet>
        <title>검색 | Muool</title>
      </Helmet>
      <div className="container mx-auto">
        {patient?.name}
        {patient?.gender}
      </div>
    </>
  );
};
