export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Math Problem Generator",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "History",
      href: "/history",
    },
    {
      label: "Score Tracker",
      href: "/score",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
  ],
};
