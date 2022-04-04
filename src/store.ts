import { makeVar } from "@apollo/client";
import { INameTag } from "./components/name-tag";
import { ListReservationsQuery } from "./graphql/generated/graphql";

// 이곳에서 전역 변수 관리

export const queryResultVar = makeVar<ListReservationsQuery | undefined>(
  undefined
);

export const listReservationRefetchVar = makeVar<any>(undefined);

export const selectedPatientVar = makeVar<null | INameTag>(null);
