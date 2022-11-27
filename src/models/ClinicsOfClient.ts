import localStorageUtils from '../utils/localStorageUtils';
import type {
  ClinicOfClient,
  IMember,
  MyClinic,
  UserIdAndName,
} from '../types/common.types';

export class ClinicsOfClient {
  static #clinics: ClinicOfClient[];
  static #userIdAndName: UserIdAndName;
  static #localStorageUtil = localStorageUtils;
  // db에서 받은 clinic에 로컬 전용 필드를 추가해야됨
  // 로컬 전용 필드
  // isActivate : display 활성 상태

  static initialize(userIdAndName: UserIdAndName) {
    this.#userIdAndName = userIdAndName;
  }

  static createClinicsOfClient(clinics: MyClinic[]) {
    return clinics.map(this.#createClinicOfClient);
  }

  static #createClinicOfClient(clinic: MyClinic): ClinicOfClient {
    const addCanSee = (member: IMember) => ({ ...member, canSee: true });
    return {
      ...clinic,
      members: clinic.members.map(addCanSee),
    };
  }

  static saveToLocalStorage(value: ClinicOfClient[]) {
    if (!this.#hasUserIdAndName) throw this.#initialError;

    this.#localStorageUtil.set({
      key: 'clinicLists',
      value,
      ...this.#userIdAndName,
    });
  }

  static getFromLocalStorage() {
    if (!this.#hasUserIdAndName) throw this.#initialError;

    return this.#localStorageUtil.get<ClinicOfClient>({
      key: 'clinicLists',
      ...this.#userIdAndName,
    });
  }

  static get #hasUserIdAndName() {
    return !!this.#userIdAndName;
  }

  static get #initialError() {
    return new Error('TableTime이 초기화되지 않았습니다.', {
      cause:
        'TableTime클래스는 초기화 메소드를 수행한 뒤에 정상작동합니다. TableTime.initialSetup()을 수행해주세요.',
    });
  }

  static combineClinic(
    clinicFromNetwork: MyClinic,
    clinicFromClient: ClinicOfClient
  ): ClinicOfClient {
    const combineCanSeeFromClient = (
      networkMember: IMember,
      clientMembers: ClinicOfClient['members']
    ) => {
      const clientMember = clientMembers.find(
        (_member) => _member.id === networkMember.id
      );
      return clientMember
        ? { ...networkMember, canSee: clientMember.canSee }
        : networkMember;
    };

    return {
      ...clinicFromNetwork,
      members: clinicFromNetwork.members.map((member) =>
        combineCanSeeFromClient(member, clinicFromClient.members)
      ),
    };
  }

  static get value() {
    return this.#clinics;
  }

  static setValue(value: ClinicOfClient[]) {
    this.#clinics = value;
  }
}
