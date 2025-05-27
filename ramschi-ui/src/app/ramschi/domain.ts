export interface ICategory {
  id: string;
  name: string;
}

export interface IBasicItem {
  id: string | null;
  name: string;
  description: string | null;
  category: string | null;
  price: number | null;
  sold: boolean;
}

export interface IItem extends IBasicItem {
  lastedit: number;
  assignees: string[];
  images: string[];
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
}
