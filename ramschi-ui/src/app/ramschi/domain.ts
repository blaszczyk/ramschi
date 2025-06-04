export interface ICategory {
  id: string;
  name: string;
}

export interface IPlainItem {
  id: string | null;
  name: string;
  description: string | null;
  category: string | null;
  price: number | null;
  sold: boolean;
}

export interface IItem extends IPlainItem {
  lastedit: number;
  assignees: string[];
  images: string[];
}

export interface IFullItem extends IPlainItem {
  assignees: string[];
  images: string[];
  comments: IComment[];
}

export interface ILoginResponse {
  success: boolean;
  role: Role;
}

export enum Role {
  ADMIN = 'ADMIN',
  CONTRIBUTOR = 'CONTRIBUTOR',
  ASSIGNEE = 'ASSIGNEE',
}

export interface IComment {
  id: string | null;
  itemId: string;
  author: string;
  text: string;
  lastEdit: number | undefined;
}

export interface IAssignee {
  name: string;
  role: Role;
  secure: boolean;
  active: boolean;
}
