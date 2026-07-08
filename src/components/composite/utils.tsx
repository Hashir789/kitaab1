import { BiSupport } from "react-icons/bi";
import { FaNoteSticky } from "react-icons/fa6";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { PLACEHOLDERS } from "@/constants/placeholders";
import { FaFolderOpen, FaComment } from "react-icons/fa";
import { Breakpoint } from "@/constants/enums";

export const sidebarItems = [
  {
    logo: <BsFillGrid3X3GapFill size={22} />,
    text: PLACEHOLDERS.SIDEBAR_LI_DASHBOARD,
    href: PLACEHOLDERS.SIDEBAR_LI_HREF_DASHBOARD
  },
  {
    logo: <FaNoteSticky size={22}/>,
    text: PLACEHOLDERS.SIDEBAR_LI_RECORDS,
    href: PLACEHOLDERS.SIDEBAR_LI_HREF_RECORDS
  },
  {
    logo: <FaFolderOpen size={24}/>,
    text: PLACEHOLDERS.SIDEBAR_LI_DEEDS,
    href: PLACEHOLDERS.SIDEBAR_LI_HREF_DEEDS
  },
  {
    logo: <FaComment size={20}/>,
    text: PLACEHOLDERS.SIDEBAR_LI_NOTIFICATIONS,
    href: PLACEHOLDERS.SIDEBAR_LI_HREF_NOTIFICATIONS
  },
  {
    logo: <BiSupport size={24}/>,
    text: PLACEHOLDERS.SIDEBAR_LI_SUPPORT,
    href: PLACEHOLDERS.SIDEBAR_LI_HREF_SUPPORT
  }
];

export const isActiveLocation = (location: string, href: string, styles: any) => {
  if (location != href) return '';
  return styles.is__active__location;
};


export const isMobile = (expanded: boolean, breakpoint: string, styles: any) => {
  if (breakpoint !== Breakpoint.Mobile) return '';
  return styles.is__mobile;
};

export const isSidebarExpanded = (sidebarExpanded: boolean, breakpoint: string, styles: any) => {
  if (breakpoint !== Breakpoint.Mobile || !sidebarExpanded) return '';
  return styles.is__sidebar__expanded;
};

export const isSidebarCollapsed = (sidebarExpanded: boolean, breakpoint: string, styles: any) => {
  if (breakpoint !== Breakpoint.Mobile || !sidebarExpanded) return '';
  return styles.is__sidebar__collapsed;
};