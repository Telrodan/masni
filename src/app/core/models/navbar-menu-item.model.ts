export interface NavbarMenuItem {
  label: string;
  routerLink?: string;
  subMenuItems?: NavbarMenuItem[];
}
