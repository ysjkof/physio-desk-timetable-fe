import { cls } from '../../../../../utils/commonUtils';
import { CheckableButton } from '../../../../../components';
import { Member } from '../../../../../models';
import type { PrimaryCountListItem } from '../../../../../types/commonTypes';
import type { MemberOfGetMyClinic } from '../../../../../types/processedGeneratedTypes';

interface TableChartCardProps extends PrimaryCountListItem {
  member: MemberOfGetMyClinic;
  query: string;
  isActive: boolean;
  onClick: () => void;
}

const TableChartCard = (props: TableChartCardProps) => {
  const {
    cancel = 0,
    newPatient = 0,
    noshow = 0,
    reservationCount = 0,
    query,
    isActive,
    onClick,
    member: _member,
  } = props;

  const member = new Member(_member);
  const nameAndState = member.getFormattedNameWithStateIfWithdrawn();
  const color = member.getColor();

  return (
    <div
      className={cls(
        'table-chart__card',
        query && !new RegExp(query).test(member.getName()) ? 'hidden' : '',
        isActive ? '' : 'border-transparent'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-1 px-1.5 text-sm font-medium">
        <CheckableButton
          checked={isActive}
          label={nameAndState}
          onClick={onClick}
          color={color}
        />
      </div>
      <div>
        <div className="flex">
          <div className="table-chart__card-field">총방문</div>
          <div className="table-chart__card-field">신규</div>
          <div className="table-chart__card-field">재방문</div>
          <div className="table-chart__card-field">취소</div>
          <div className="table-chart__card-field">부도</div>
        </div>
        <div className="flex">
          <div className="table-chart__card-field table-chart__card-field-contents">
            {reservationCount}
          </div>
          <div className="table-chart__card-field table-chart__card-field-contents">
            {newPatient}
          </div>
          <div className="table-chart__card-field table-chart__card-field-contents">
            {reservationCount - newPatient}
          </div>
          <div className="table-chart__card-field table-chart__card-field-contents">
            {cancel}
          </div>
          <div className="table-chart__card-field table-chart__card-field-contents">
            {noshow}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableChartCard;
