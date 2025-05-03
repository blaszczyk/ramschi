export interface ICategory {
    id: string;
    name: string;
    symbol: string;
}

export interface IBasicItem {
    id: string | null;
    name: string;
    description: string | null;
    category: string | null;
    price: number | null;
}

export interface IItem extends IBasicItem {
    assignees: string[];
    images: string[];
}
