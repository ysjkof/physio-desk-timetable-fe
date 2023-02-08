import localStorageUtils from '../utils/localStorage.utils';
import { ClinicType } from '../types/generated.types';
import type {
  ClinicOfClient,
  ClinicOfClientState,
  IMember,
  MyClinic,
  UserIdAndName,
} from '../types/common.types';

export class ClinicsOfClient {
  static #clinics: ClinicOfClient[];

  static #userIdAndName: UserIdAndName;

  static #localStorageUtil = localStorageUtils;

  static initialize(userIdAndName: UserIdAndName, clinics: MyClinic[]) {
    this.#userIdAndName = userIdAndName;

    const localClinics = this.#getFromLocalStorage();
    const latestClinics = this.createClinicsOfClient(clinics);
    if (localClinics === null) {
      this.saveToLocalStorage(latestClinics);
      this.set(latestClinics);
      return this.get();
    }

    const updatedMyClinics = latestClinics.map((latestClinic) => {
      const localClinic = localClinics.find(
        (_localClinic) => _localClinic.id === latestClinic.id
      );
      return localClinic
        ? this.combineClinic(latestClinic, localClinic)
        : latestClinic;
    });

    this.set(updatedMyClinics);
    return this.get();
  }

  static createClinicsOfClient(clinics: MyClinic[]) {
    return clinics.map(this.#createClinicOfClient);
  }

  static #createClinicOfClient(clinic: MyClinic) {
    const addCanSee = (member: IMember) => ({ ...member, canSee: true });

    const property =
      clinic.type === ClinicType.Personal
        ? ClinicsOfClient.#getKeyForPersonal()
        : ClinicsOfClient.#getKeyForGroup(clinic);

    return {
      ...clinic,
      members: clinic.members.map(addCanSee),
      ...property,
    };
  }

  static #getKeyForPersonal(): ClinicOfClientState {
    return {
      isSelected: true,
      isManager: true,
      isStayed: true,
      isAccepted: true,
      position: '관리자',
    };
  }

  static #getKeyForGroup(clinic: MyClinic): ClinicOfClientState {
    const userInClinic = clinic.members.find(
      (member) => member.user.id === this.#userIdAndName.userId
    );

    if (!userInClinic)
      throw new Error('', {
        cause: 'user.id와 일치하는 clinic.member가 없습니다.',
      });

    return {
      isSelected: false,
      isManager: userInClinic.manager,
      isStayed: userInClinic.staying,
      isAccepted: userInClinic.accepted,
      position: userInClinic.manager ? '관리자' : '직원',
    };
  }

  static saveToLocalStorage(value: ClinicOfClient[]) {
    if (!this.#userIdAndName) throw this.#getInitialError();

    this.#localStorageUtil.set({
      key: 'clinicLists',
      value,
      ...this.#userIdAndName,
    });
  }

  static #getFromLocalStorage() {
    if (!this.#userIdAndName) throw this.#getInitialError();

    return this.#localStorageUtil.get<ClinicOfClient[]>({
      key: 'clinicLists',
      ...this.#userIdAndName,
    });
  }

  static #getInitialError() {
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
      isSelected: clinicFromClient.isSelected,
      isManager: clinicFromClient.isManager,
      isStayed: clinicFromClient.isStayed,
      isAccepted: clinicFromClient.isAccepted,
      position: clinicFromClient.position,
    };
  }

  static get() {
    return this.#clinics;
  }

  static getPersonalClinic() {
    const personalClinic = ClinicsOfClient.#clinics.find(
      (clinic) => clinic.type === ClinicType.Personal
    );

    if (!personalClinic)
      throw new Error('Clinic Type이 personal인 Clinic이 없습니다.');

    return personalClinic;
  }

  static getSelectedClinic(): ClinicOfClient {
    const selectedClinic = this.#clinics.find((clinic) => clinic.isSelected);
    if (!selectedClinic)
      throw new Error('selectedClinic이 없습니다.', { cause: '없어!!' });
    return selectedClinic;
  }

  static getWaitingClinic() {
    return this.#clinics.filter(
      (clinic) => !clinic.isAccepted && !clinic.isStayed
    );
  }

  static getById(id: number) {
    return this.#clinics.find((clinic) => clinic.id === id);
  }

  static set(value: ClinicOfClient[]) {
    this.#clinics = value;
  }

  static selectClinic(id: number) {
    this.#clinics = this.#clinics.map((clinic) => {
      if (clinic.id === id) {
        return { ...clinic, isSelected: true };
      }
      if (clinic.isSelected) {
        return { ...clinic, isSelected: false };
      }
      return clinic;
    });
  }

  static toggleUserCanSee(memberId: number) {
    const { id, members } = ClinicsOfClient.getSelectedClinic();
    const canSeeLength = members.filter((member) => member.canSee).length;

    if (canSeeLength <= 1) return false;

    const newMembers = members.map((member) => {
      if (member.id !== memberId) return member;
      return { ...member, canSee: !member.canSee };
    });

    return this.#clinics.map((clinic) => {
      if (clinic.id !== id) return clinic;
      return { ...clinic, members: newMembers };
    });
  }
}
