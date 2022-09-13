import { useLocation } from 'react-router-dom';
import Sidebar from '../../../../components/organisms/Sidebar';
import { ENDPOINT, ROUTES } from '../../../../router/routes';

export default function DocsSidebar() {
  const docsMenu = [
    {
      route: `${ROUTES.docs}/`,
      name: '처음 예약하기',
      children: [
        { route: ENDPOINT.docs.basic_patient_registration, name: '환자 등록' },
        {
          route: ENDPOINT.docs.basic_prescription_registration,
          name: '처방 등록',
        },
        { route: ENDPOINT.docs.basic_reserve, name: '예약하기' },
      ],
    },

    {
      route: `${ROUTES.docs}/`,
      name: '기타',
      children: [
        { route: ENDPOINT.docs.roadmap, name: '개발 계획' },
        { route: ENDPOINT.docs.contacts, name: '연락처' },
      ],
    },
    // {
    //   route: `${ROUTES.docs}/`,
    //   name: '화면 설명',
    //   children: [{ route: screen_timetable, name: '시간표' }],
    // },

    // {
    //   route: `${ROUTES.docs}/`,
    //   name: '병원',
    //   children: [{ route: clinic_registration, name: '병원 만들기' }],
    // },

    // {
    //   route: `${ROUTES.docs}/`,
    //   name: '대시보드 메뉴 안내',
    //   children: [
    //     ...clinicMenu.map((menu) => ({
    //       ...menu,
    //       route: `${dashboard}_menu.route`,
    //     })),
    //     ...personalMenu.map((menu) => ({
    //       ...menu,
    //       route: `${dashboard}_menu.route`,
    //     })),
    //   ],
    // },
  ];

  const location = useLocation();

  const splitted = location.pathname.split('/');
  const endpoint = splitted[splitted.length - 1];

  return (
    <aside className="sm:w-52">
      <Sidebar>
        {docsMenu.map((menu) => (
          <Sidebar.Ul key={menu.name} title={menu.name}>
            {menu.children.map((submenu) => (
              <Sidebar.Li
                key={submenu.name}
                to={menu.route + submenu.route}
                selected={endpoint === submenu.route}
              >
                {submenu.name}
              </Sidebar.Li>
            ))}
          </Sidebar.Ul>
        ))}
      </Sidebar>
    </aside>
  );
}
