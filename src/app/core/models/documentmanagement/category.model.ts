import { FileKind } from "./document.model";

export interface DocumentCategory {
    id: number;
    parentId: number;
    docCategory: string;
    sortOrder?: number;
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

export type TreeNode = DocumentCategory & Partial<FileTreeNode>;

export interface PatientFile {
    id: number;
    docCatId: number;      // the folder (DocumentCategory.id) this file belongs to
    orgFileName: string;
    fileKind: FileKind;
    fileSize: number;
    fileTags?: string | null;
    createdDate: Date;
    savedFileName:string;
}

/** A file represented as a tree node (so it can live inside DocumentCategory.children). */
export interface FileTreeNode {
    nodeType: 'file';
    id: number;
    docCatId: number;
    orgFileName: string;
    fileKind: FileKind;
    fileSize: number;
    fileTags?: string | null;
    createdDate: Date;
    children?: undefined;
    file: PatientFile;       // original object, emitted on selection
    savedFileName:string;
}
export function isFileNode(node: any): node is FileTreeNode {
    return node?.nodeType === 'file';
}

export function mergeFilesIntoTree(categories: DocumentCategory[], files: PatientFile[]): TreeNode[] {
    const byCategory = new Map<number, PatientFile[]>();
    for (const f of files ?? []) {
        const list = byCategory.get(f.docCatId) ?? [];
        list.push(f);
        byCategory.set(f.docCatId, list);
    }

    const walk = (nodes: DocumentCategory[]): TreeNode[] =>
        (nodes ?? []).map((cat) => {
            const ownFiles = byCategory.get(cat.id) ?? [];
            const subCategories = walk(cat.children ?? []);
            const fileNodes: FileTreeNode[] = ownFiles.map((f) => ({
                nodeType: 'file',
                id: f.id,
                docCatId: f.docCatId,
                orgFileName: f.orgFileName,
                fileKind: f.fileKind,
                fileSize: f.fileSize,
                fileTags: f.fileTags,
                createdDate: f.createdDate,
                file: f,
                savedFileName:f.savedFileName,
                docCategory: f.orgFileName,
            }));

            return {
                ...cat,
                documentCount: ownFiles.length || cat.documentCount,
                children: [...subCategories, ...(fileNodes as unknown as DocumentCategory[])],
            } as TreeNode;
        });

    return walk(categories);
}
