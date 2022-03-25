import { ApolloQueryResult, makeVar } from "@apollo/client";
import {
  Exact,
  ListReservationsInput,
  ListReservationsQuery,
} from "./graphql/generated/graphql";

export const queryResultVar = makeVar<ListReservationsQuery | undefined>(
  undefined
);

export const listReservationRefetchVar = makeVar<any>(undefined);
