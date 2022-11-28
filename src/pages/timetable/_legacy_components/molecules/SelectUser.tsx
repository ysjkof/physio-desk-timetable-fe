import { UseFormRegisterReturn } from 'react-hook-form';
import { MemberOfClient } from '../../../../types/common.types';

interface SelectUserProps {
  members: MemberOfClient[];
  register: UseFormRegisterReturn;
}
export default function SelectUser({ members, register }: SelectUserProps) {
  return (
    <select {...register} className="w-full rounded-md border text-center">
      {members.map((m) => (
        <option key={m.id} value={m.user.id}>
          {m.user.name}
        </option>
      ))}
    </select>
  );
}
