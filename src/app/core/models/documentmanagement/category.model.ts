export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  children: Category[];
  documentCount?: number;
}

/** Flat, display-friendly representation used by the CDK tree */
export interface CategoryFlatNode {
  id: string;
  name: string;
  level: number;
  expandable: boolean;
  icon?: string;
  color?: string;
  documentCount?: number;
}
