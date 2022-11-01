import { UseFormRegisterReturn } from 'react-hook-form';
import { IMemberWithActivate } from '../../../../types/common.types';

interface EventBoxProps {
  members: IMemberWithActivate[];
  register: UseFormRegisterReturn;
}
export default function SelectUser({ members, register }: EventBoxProps) {
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
