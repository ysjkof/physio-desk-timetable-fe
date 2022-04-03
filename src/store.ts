import { makeVar } from "@apollo/client";
import { ListReservationsQuery } from "./graphql/generated/graphql";

export const queryResultVar = makeVar<ListReservationsQuery | undefined>(
  undefined
);

export const listReservationRefetchVar = makeVar<any>(undefined);
