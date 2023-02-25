import { useGetClinic } from '../../../../../hooks';
import { PrimaryCountListItem } from '../../../../../types/commonTypes';

interface TableChartCardProps extends PrimaryCountListItem {
  userId: string;
}

const TableChartCard = (props: TableChartCardProps) => {
  const { cancel, newPatient, noshow, reservationCount, userId } = props;
  const [myClinic] = useGetClinic();
  const member = myClinic?.members.find(
    (member) => member.user.id === Number.parseInt(userId, 10)
  );

  return (
    <div className="table-chart__card">
      <div className="flex items-center gap-1 px-1.5 text-sm font-medium">
        <div className="h-3 w-3 rounded-sm bg-red-300"></div>
        {member?.user.name}
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
