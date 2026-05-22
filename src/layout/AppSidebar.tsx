import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon
} from "../icons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import AddIcon from '@mui/icons-material/Add';
import Logo from "../../public/aztu_logo.webp";
import { Link, useLocation } from "react-router";
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import HistoryIcon from '@mui/icons-material/History';
import { useSidebar } from "../context/SidebarContext";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import { useCallback, useEffect, useRef, useState } from "react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};


const getMainItems = (role: number): NavItem[] => {
  const navItems: NavItem[] = [
    {
      icon: <GridIcon />,
      name: "Əsas",
      path: "/home"
    }, {
      icon: <AddIcon />,
      name: "Yeni Plan",
      path: "/new-plan",
    }, {
      name: "Planım",
      icon: <ListIcon />,
      path: "/my-plan"
    }, {
      name: "Hesabatım",
      icon: <ListIcon />,
      path: "/my-hesabat"
    }, {
      name: "Kafedralarım",
      icon: <SchoolIcon />,
      path: "/my-cafedras"
    }, {
      name: "Fakültələr",
      icon: <SchoolIcon />,
      path: "/faculties"
    }, {
      name: "İcraya məsul şəxslər",
      icon: <PeopleIcon />,
      path: "/report-users"
    }, {
      name: "Təsdiq gözləyən istifadəçilər",
      icon: <PeopleAltIcon />,
      path: "/approve-waiting-users"
    }, {
      name: "Bütün istifadəçilər",
      icon: <PeopleAltIcon />,
      path: "/all-users"
    }, {
      name: "Bütün planlar",
      icon: <ListIcon />,
      path: "/all-plans"
    }, {
      name: "Bölmələr üzrə planlar",
      icon: <SchoolIcon />,
      path: "/cafedra-plans"
    }, {
      name: "Təhvil verilmiş hesabatlar",
      icon: <ListIcon />,
      path: "/submitted-hesabats"
    }, {
      name: "Arxiv",
      icon: <HistoryIcon />,
      path: "/archive"
    }, {
      name: "Kafedram",
      icon: <SchoolIcon />,
      path: "/archive"
    }, {
      name: "Tənzimləmələr",
      icon: <SettingsIcon />,
      subItems: [
        { name: "Aktivlik növləri", path: "/settings/activities" },
        { name: "Fakültələr", path: "/settings/faculties" },
        { name: "Kafedralar", path: "/settings/cafedras" },
        { name: "Vəzifələr", path: "/settings/duties" },
        { name: "Şöbələr", path: "/settings/departments" }
      ]
    }
  ];

  if (role === 1) {
    return navItems.filter(item => {
      console.log("role 1 filtering item:", item.name);
      return (
        item.name !== "Yeni Plan" &&
        item.name !== "Planım" &&
        item.name !== "Hesabatım" &&
        item.name !== "Kafedralarım" &&
        item.name !== "Kafedram"
      );
    });
  } else if (role === 2) {
    return navItems.filter(item => {
      return (
        item.name !== "Fakültələr" &&
        item.name !== "Arxiv" &&
        item.name !== "Bütün istifadəçilər" &&
        item.name !== "Bütün planlar" &&
        item.name !== "Bölmələr üzrə planlar" &&
        item.name !== "Təhvil verilmiş hesabatlar" &&
        item.name !== "İcraya məsul şəxslər" &&
        item.name !== "Təsdiq gözləyən istifadəçilər" &&
        item.name !== "Bütün hesabatlar" &&
        item.name !== "Kafedram" &&
        item.name !== "Tənzimləmələr"
      )
    });
  } else if (role === 3) {
    return navItems.filter(item => {
      return (
        item.name !== "Kafedralarım" &&
        item.name !== "Fakültələr" &&
        item.name !== "Arxiv" &&
        item.name !== "Bütün istifadəçilər" &&
        item.name !== "Bütün planlar" &&
        item.name !== "Bölmələr üzrə planlar" &&
        item.name !== "Təhvil verilmiş hesabatlar" &&
        item.name !== "Bütün hesabatlar" &&
        item.name !== "İcraya məsul şəxslər" &&
        item.name !== "Təsdiq gözləyən istifadəçilər" &&
        item.name !== "Tənzimləmələr"
      )
    });
  } else if (role === 4) {
    return navItems.filter(item => {
      return (
        item.name !== "Kafedralarım" &&
        item.name !== "Fakültələr" &&
        item.name !== "Arxiv" &&
        item.name !== "Bütün istifadəçilər" &&
        item.name !== "Bütün planlar" &&
        item.name !== "Bölmələr üzrə planlar" &&
        item.name !== "Təhvil verilmiş hesabatlar" &&
        item.name !== "Bütün hesabatlar" &&
        item.name !== "İcraya məsul şəxslər" &&
        item.name !== "Təsdiq gözləyən istifadəçilər" &&
        item.name !== "Kafedram" &&
        item.name !== "Tənzimləmələr"
      )
    });
  } else {
    return navItems.filter(item => item.name !== "Tənzimləmələr");
  }
}


const getOthersItems = (role: number): NavItem[] => {
  const items: NavItem[] = [
    { icon: <PersonIcon />, name: "Dekanlar", path: "/dekans" },
  ];

  switch (role) {
    case 1:
      // Hide "Fakültəm" and "Kafedram"
      return items.filter(item => item.name !== "Fakültəm" && item.name !== "Kafedram");
    case 2:
      // Hide "Kafedram", "Dekanlar" and "Kafedra müdirləri"
      return items.filter(item => !["Kafedram", "Dekanlar", "Kafedra müdirləri"].includes(item.name));
    case 3:
      // Only display "Kafedram"
      return items.filter(item => item.name === "Kafedram");
    default:
      // Role 4 or others: display nothing
      return [];
  }
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    const mainItems = getMainItems(role);
    const otherItems = getOthersItems(role);

    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? mainItems : otherItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              {openSubmenu?.type === menuType && openSubmenu?.index === index && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-500 to-brand-700" />
              )}
              <span
                className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                title={isCollapsed ? nav.name : undefined}
                className={`menu-item group relative ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  } ${isCollapsed ? "lg:justify-center" : ""}`}
              >
                {isActive(nav.path) && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-500 to-brand-700" />
                )}
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const roleFromStore: number | null = useSelector((state: RootState) => state.auth.role);
  const role = roleFromStore ?? 0;
  const othersItems = getOthersItems(role);

  const isCollapsed = !isExpanded && !isHovered && !isMobileOpen;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white/95 backdrop-blur-xl dark:bg-gray-900/95 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 shadow-[0_8px_30px_rgba(16,24,40,0.04)]
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-6 flex ${isCollapsed ? "lg:justify-center" : "justify-start"}`}
      >
        <Link
          to="/home"
          className={`group flex items-center gap-3 ${isCollapsed ? "justify-center w-full" : ""}`}
        >
          <div className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-2.5 shadow-lg shadow-brand-500/30 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105">
            <img
              src={Logo}
              alt="AzTU"
              className="h-8 w-8 object-contain drop-shadow"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-semibold tracking-tight text-gray-900 dark:text-white">
                AzTU
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Plan • Hesabat
              </span>
            </div>
          )}
        </Link>
      </div>
      <div className="relative flex-1 -mx-2 px-2 flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-6">
            <div>
              <div
                className={`mb-3 flex items-center ${isCollapsed ? "lg:justify-center" : "justify-between"
                  }`}
              >
                {isCollapsed ? (
                  <HorizontaLDots className="size-5 text-gray-400" />
                ) : (
                  <>
                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Menyu
                    </h2>
                    <span className="h-px flex-1 ml-3 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
                  </>
                )}
              </div>
              {renderMenuItems(getMainItems(role), "main")}
            </div>
            {role < 4 && othersItems.length > 0 && (
              <div>
                <div
                  className={`mb-3 flex items-center ${isCollapsed ? "lg:justify-center" : "justify-between"
                    }`}
                >
                  {isCollapsed ? (
                    <HorizontaLDots className="size-5 text-gray-400" />
                  ) : (
                    <>
                      <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                        Digər
                      </h2>
                      <span className="h-px flex-1 ml-3 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
                    </>
                  )}
                </div>
                {renderMenuItems(othersItems, "others")}
              </div>
            )}
          </div>
        </nav>
      </div>

      {!isCollapsed && (
        <div className="mt-auto mb-4 pt-4">
          <div className="relative overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-brand-50 p-4 dark:border-brand-500/20 dark:from-brand-500/[0.08] dark:via-gray-900 dark:to-brand-500/[0.04]">
            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l2.39 4.84L20 7.27l-4 3.9.94 5.51L12 14.5l-4.94 2.18.94-5.51-4-3.9 5.61-.43L12 2z" fill="currentColor" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-white">
                  AzTU Sistemi
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                  Plan və hesabatların idarə paneli
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
