import Sidebar from '../../../../components/organisms/Sidebar';

export default function DocsSidebar() {
  return (
    <aside className="w-full max-w-xs border-r">
      <Sidebar>
        <Sidebar.Ul>
          <Sidebar.Ul title="사용방법">
            <Sidebar.Li to="">직원 초대하기</Sidebar.Li>
            <Sidebar.Li to="">병원 만들기</Sidebar.Li>
          </Sidebar.Ul>
        </Sidebar.Ul>
        <Sidebar.Ul>
          <Sidebar.Ul title="코어 컨셉">
            <Sidebar.Li to="">초대 수락하기</Sidebar.Li>
            <Sidebar.Li to="">그담에 기타등등</Sidebar.Li>
          </Sidebar.Ul>
        </Sidebar.Ul>
      </Sidebar>
    </aside>
  );
}
