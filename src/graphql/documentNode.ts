import gql from 'graphql-tag';

export const AcceptInvitation = gql`
    mutation acceptInvitation($input: AcceptInvitationInput!) {
  acceptInvitation(input: $input) {
    ok
    error
  }
}
    `;
export const CancelInvitation = gql`
    mutation cancelInvitation($input: CancelInvitationInput!) {
  cancelInvitation(input: $input) {
    ok
    error
  }
}
    `;
export const CreateClinic = gql`
    mutation createClinic($input: CreateClinicInput!) {
  createClinic(input: $input) {
    ok
    error
    clinic {
      id
      name
      type
      isActivated
      members {
        id
        staying
        manager
        accepted
        user {
          id
          name
        }
      }
    }
  }
}
    `;
export const FindMyClinics = gql`
    query findMyClinics($input: FindMyClinicsInput!) {
  findMyClinics(input: $input) {
    ok
    error
    clinics {
      id
      name
      type
      isActivated
      members {
        id
        staying
        manager
        accepted
        user {
          id
          name
        }
        clinic {
          id
          name
        }
      }
    }
  }
}
    `;
export const GetClinic = gql`
    query getClinic($input: GetClinicInput!) {
  getClinic(input: $input) {
    ok
    error
    clinic {
      id
      name
      members {
        id
        staying
        manager
        accepted
        user {
          id
          name
          email
        }
      }
    }
  }
}
    `;
export const InactivateClinic = gql`
    mutation inactivateClinic($input: InactivateClinicInput!) {
  inactivateClinic(input: $input) {
    ok
    error
  }
}
    `;
export const InviteUser = gql`
    mutation inviteUser($input: InviteUserInput!) {
  inviteUser(input: $input) {
    ok
    error
  }
}
    `;
export const LeaveClinic = gql`
    mutation leaveClinic($input: LeaveClinicInput!) {
  leaveClinic(input: $input) {
    ok
    error
  }
}
    `;
export const CreatePatient = gql`
    mutation createPatient($input: CreatePatientInput!) {
  createPatient(input: $input) {
    ok
    error
    patient {
      id
      name
      gender
      registrationNumber
      birthday
      memo
    }
  }
}
    `;
export const EditPatient = gql`
    mutation editPatient($input: EditPatientInput!) {
  editPatient(input: $input) {
    error
    ok
  }
}
    `;
export const FindAllPatients = gql`
    query findAllPatients($input: FindAllPatientsInput!) {
  findAllPatients(input: $input) {
    ok
    error
    totalPages
    totalCount
    results {
      id
      name
      gender
      registrationNumber
      birthday
      clinic {
        name
      }
    }
  }
}
    `;
export const GetPatients = gql`
    query getPatients($input: GetPatientsInput!) {
  getPatients(input: $input) {
    ok
    error
    patients {
      id
      name
      gender
      registrationNumber
      birthday
      memo
    }
  }
}
    `;
export const SearchPatient = gql`
    query searchPatient($input: SearchPatientInput!) {
  searchPatient(input: $input) {
    error
    ok
    totalPages
    totalCount
    patients {
      id
      name
      gender
      registrationNumber
      birthday
      clinic {
        id
        name
      }
      users {
        id
        name
      }
    }
  }
}
    `;
export const CreateAtomPrescription = gql`
    mutation createAtomPrescription($input: CreateAtomPrescriptionInput!) {
  createAtomPrescription(input: $input) {
    ok
    error
  }
}
    `;
export const CreatePrescription = gql`
    mutation createPrescription($input: CreatePrescriptionInput!) {
  createPrescription(input: $input) {
    ok
    error
    prescription {
      id
      name
      requiredTime
      description
      price
      activate
      prescriptionAtoms {
        id
        name
      }
    }
  }
}
    `;
export const EditPrescription = gql`
    mutation editPrescription($input: EditPrescriptionInput!) {
  editPrescription(input: $input) {
    ok
    error
  }
}
    `;
export const FindAtomPrescriptions = gql`
    query findAtomPrescriptions {
  findAtomPrescriptions {
    ok
    error
    results {
      id
      name
    }
  }
}
    `;
export const FindPrescriptions = gql`
    query findPrescriptions($input: FindPrescriptionsInput!) {
  findPrescriptions(input: $input) {
    ok
    error
    prescriptions {
      id
      name
      requiredTime
      description
      price
      activate
      prescriptionAtoms {
        id
        name
      }
    }
  }
}
    `;
export const CreateDayOff = gql`
    mutation createDayOff($input: CreateDayOffInput!) {
  createDayOff(input: $input) {
    ok
    error
  }
}
    `;
export const CreateReservation = gql`
    mutation createReservation($input: CreateReservationInput!) {
  createReservation(input: $input) {
    ok
    error
  }
}
    `;
export const DeleteReservation = gql`
    mutation deleteReservation($input: DeleteReservationInput!) {
  deleteReservation(input: $input) {
    error
    ok
  }
}
    `;
export const EditReservation = gql`
    mutation editReservation($input: EditReservationInput!) {
  editReservation(input: $input) {
    error
    ok
  }
}
    `;
export const GetReservationsByPatient = gql`
    query getReservationsByPatient($input: GetReservationsByPatientInput!) {
  getReservationsByPatient(input: $input) {
    ok
    error
    totalPages
    totalCount
    results {
      id
      startDate
      endDate
      state
      memo
      isFirst
      prescriptions {
        name
        requiredTime
      }
      user {
        id
        name
      }
      lastModifier {
        id
        name
      }
    }
  }
}
    `;
export const GetStatistics = gql`
    query getStatistics($input: GetStatisticsInput!) {
  getStatistics(input: $input) {
    error
    ok
    prescriptions {
      id
      name
      price
      requiredTime
    }
    visitRates {
      patientId
      visited
    }
    dailyReports {
      date
      reservationCount
      noshow
      cancel
      newPatient
      users {
        userId
        reservationCount
        noshow
        cancel
        newPatient
        visitMoreThanThirty
        visitMoreThanSixty
        visitMoreThanNinety
        prescriptions {
          id
          name
          count
        }
        reservations {
          id
          startDate
          endDate
          state
          memo
          isFirst
          prescriptions {
            id
            name
            price
            requiredTime
          }
          patient {
            id
            name
          }
          lastModifier {
            id
            name
          }
        }
      }
    }
  }
}
    `;
export const ListReservations = gql`
    query listReservations($input: ListReservationsInput!) {
  listReservations(input: $input) {
    ok
    totalCount
    results {
      id
      startDate
      endDate
      state
      memo
      isFirst
      user {
        id
        name
      }
      patient {
        id
        name
        gender
        registrationNumber
        birthday
        memo
      }
      lastModifier {
        id
        email
        name
        updatedAt
      }
      clinic {
        id
        name
      }
      prescriptions {
        id
        name
        requiredTime
        description
        price
      }
    }
  }
}
    `;
export const ListenUpdateReservation = gql`
    subscription listenUpdateReservation($input: UpdateReservationInput!) {
  listenUpdateReservation(input: $input) {
    id
    startDate
    endDate
    state
    memo
    isFirst
    user {
      id
    }
    patient {
      id
      name
    }
    lastModifier {
      id
      email
      name
      updatedAt
    }
    clinic {
      id
    }
    prescriptions {
      id
    }
  }
}
    `;
export const ListenDeleteReservation = gql`
    subscription listenDeleteReservation($input: ListenDeleteReservationInput!) {
  listenDeleteReservation(input: $input) {
    id
    clinicId
  }
}
    `;
export const CheckAdmin = gql`
    query checkAdmin($code: String!) {
  checkAdmin(code: $code) {
    ok
    error
  }
}
    `;
export const CreateAccount = gql`
    mutation createAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    ok
    error
  }
}
    `;
export const EditProfile = gql`
    mutation editProfile($input: EditProfileInput!) {
  editProfile(input: $input) {
    ok
    error
  }
}
    `;
export const Login = gql`
    mutation login($input: LoginInput!) {
  login(input: $input) {
    ok
    token
    error
  }
}
    `;
export const Me = gql`
    query me {
  me {
    id
    name
    email
    role
    verified
    members {
      id
      staying
      manager
      accepted
      clinic {
        id
        name
        isActivated
        type
      }
    }
    notice {
      message
      read
    }
  }
}
    `;
export const SearchUsers = gql`
    query searchUsers($input: SearchUsersInput!) {
  searchUsers(input: $input) {
    ok
    error
    totalCount
    results {
      id
      name
      email
    }
  }
}
    `;
export const SendChangeEmail = gql`
    mutation sendChangeEmail($input: SendChangeEmailInput!) {
  sendChangeEmail(input: $input) {
    ok
    error
  }
}
    `;
export const VerifyChangeEmail = gql`
    mutation verifyChangeEmail($input: VerifyChangeEmailInput!) {
  verifyChangeEmail(input: $input) {
    ok
    error
  }
}
    `;
export const VerifyEmail = gql`
    mutation verifyEmail($input: VerifyEmailInput!) {
  verifyEmail(input: $input) {
    ok
    error
  }
}
    `;