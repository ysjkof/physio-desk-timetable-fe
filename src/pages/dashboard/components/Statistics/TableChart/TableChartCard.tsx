import { useGetClinic } from '../../../../../hooks';
import { cls } from '../../../../../utils/commonUtils';
import { CheckableButton } from '../../../../../components';
import { USER_COLORS } from '../../../../../constants/constants';
import type { PrimaryCountListItem } from '../../../../../types/commonTypes';

interface TableChartCardProps extends PrimaryCountListItem {
  userId: string;
  query: string;
  isActivate: boolean;
  onClick: () => void;
}

const TableChartCard = (props: TableChartCardProps) => {
  const {
    cancel,
    newPatient,
    noshow,
    reservationCount,
    userId,
    query,
    isActivate,
    onClick,
  } = props;

  const [myClinic] = useGetClinic();

  const name =
    myClinic?.members.find(
      (member) => member.user.id === Number.parseInt(userId, 10)
    )?.user.name || '';

  return (
    <div
      className={cls(
        'table-chart__card',
        query && !new RegExp(query).test(name) ? 'hidden' : '',
        isActivate ? '' : 'border-transparent'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-1 px-1.5 text-sm font-medium">
        <CheckableButton
          canSee={isActivate}
          label={name}
          onClick={onClick}
          hasBorder={false}
          personalColor={USER_COLORS[+userId].deep}
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
