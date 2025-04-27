export enum Category {
    GARDEN = 'GARDEN',
    FURNITURE = 'FURNITURE',
    ELECTRONICS = 'ELECTRONICS',
    ART = 'ART',
    OTHER = 'OTHER',
}

export interface IBasicItem {
    id: string | null;
    name: string;
    description: string;
    category: Category;
}

export interface IItem extends IBasicItem {
    assignees: string[];
    images: string[];
}
