import Sidebar from '../../../../components/organisms/Sidebar';
import { docsMenu } from '../../../../router/routes';

export default function DocsSidebar() {
  return (
    <aside className="w-full max-w-xs border-r">
      <Sidebar>
        {docsMenu.map((menu) => (
          <Sidebar.Ul key={menu.name} title={menu.name}>
            {menu.children.map((submenu) => (
              <Sidebar.Li key={submenu.name} to={menu.route + submenu.route}>
                {submenu.name}
              </Sidebar.Li>
            ))}
          </Sidebar.Ul>
        ))}
      </Sidebar>
    </aside>
  );
}
