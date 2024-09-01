export interface MenuItem {
  path: string;
  name: string;
  children?: MenuItem[];
  meta: {
    title: string;
    icon?: string;
    rank?: number;
    roles?: string;
    auths?: string;
  };
}
