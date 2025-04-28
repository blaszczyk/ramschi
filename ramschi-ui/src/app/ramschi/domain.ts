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
    description: string | null;
    category: Category | null;
    price: number | null;
}

export interface IItem extends IBasicItem {
    assignees: string[];
    images: string[];
}

export function categoryDisplayName(category: Category) {
    switch(category) {
        case Category.GARDEN: return 'Garten';
        case Category.FURNITURE: return 'Möbel';
        case Category.ELECTRONICS: return 'Elektronik';
        case Category.ART: return 'Kunst';
        case Category.OTHER: return 'Sonstiges';
    }
}