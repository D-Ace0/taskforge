export const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "⌂",
  },
  {
    label: "Workspaces",
    href: "/workspaces",
    icon: "◇",
  },
  {
    label: "Profile settings",
    href: "/settings/profile",
    icon: "○",
  },
];

export function isNavigationItemActive(
  pathname: string,
  href: string,
) {
  if (pathname === href) {
    return true;
  }

  return href !== "/dashboard" && pathname.startsWith(`${href}/`);
}
