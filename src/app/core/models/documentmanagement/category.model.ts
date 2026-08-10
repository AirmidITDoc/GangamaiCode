export interface DocumentCategory {
    id: number;
    parentId: number;
    docCategory: string;
    icon?: string;
    children: DocumentCategory[];
    documentCount?: number;
}

/** Flat, display-friendly representation used by the CDK tree */
export interface DocumentCategoryFlatNode {
    id: string;
    name: string;
    level: number;
    expandable: boolean;
    icon?: string;
    documentCount?: number;
}
