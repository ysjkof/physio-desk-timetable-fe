import { useSubscription } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ListenUpdateReservationDocument } from "../graphql/generated/graphql";
export const Test = () => {
  const { data } = useSubscription(ListenUpdateReservationDocument, {
    variables: { input: { clinicId: 11 } },
  });
  useEffect(() => {
    console.log("섭스크립션", data);
  }, [data]);

  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <h1 className="font-bold">TEST PAGE</h1>
      <div className="flex h-[500px]"></div>
    </>
  );
};
