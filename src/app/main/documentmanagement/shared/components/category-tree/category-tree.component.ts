import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { isFileNode, PatientFile, TreeNode } from 'app/core/models/documentmanagement/category.model';

@Component({
    selector: 'app-category-tree',
    templateUrl: './category-tree.component.html',
    styleUrls: ['./category-tree.component.scss'],
})
export class CategoryTreeComponent implements OnChanges {
    /** Category tree. Files may already be merged in as children (see mergeFilesIntoTree). */
    @Input() nodes: TreeNode[] = [];
    @Input() manageable = false;
    @Input() selectable = true;
    @Input() selectedId: string | null = null;
    @Input() selectedFileId: number | null = null;
    @Input() expandAll = false;
    @Input() showDocumentActions = false;

    @Output() select = new EventEmitter<number>();
    @Output() selectFile = new EventEmitter<PatientFile>();
    @Output() downloadFile = new EventEmitter<PatientFile>();
    @Output() addChild = new EventEmitter<any>();
    @Output() uploadDocument = new EventEmitter<number>();
    @Output() viewDocuments = new EventEmitter<number>();
    @Output() generateQrCode = new EventEmitter<number>();

    // Files have no children, so the existing accessor works for both node kinds.
    treeControl = new NestedTreeControl<TreeNode>((node) => node.children as TreeNode[]);
    dataSource = new MatTreeNestedDataSource<TreeNode>();

    ngOnChanges(): void {
        this.dataSource.data = this.nodes;
        if (this.expandAll) {
            queueMicrotask(() => this.expandAllNodes(this.nodes));
        }
    }

    private expandAllNodes(nodes: TreeNode[]): void {
        for (const n of nodes) {
            if (isFileNode(n)) continue;
            this.treeControl.expand(n);
            if (n.children) this.expandAllNodes(n.children as TreeNode[]);
        }
    }

    isFile = (_: number, node: TreeNode): boolean => isFileNode(node);

    hasChild = (_: number, node: TreeNode): boolean =>
        !isFileNode(node) && !!node.children;

    onSelect(node: TreeNode): void {
        if (!this.selectable) return;
        this.select.emit(node.id);
    }

    onSelectFile(node: TreeNode): void {
        if (!this.selectable || !isFileNode(node)) return;
        this.selectFile.emit(node.file);
    }

    fileIcon(node: TreeNode): string {
        const t = this.kind(node);
        return t === 'pdf' ? 'picture_as_pdf' : t === 'image' ? 'image' : 'description';
    }

    fileColor(node: TreeNode): string {
        const t = this.kind(node);
        return t === 'pdf' ? '#d32f2f' : t === 'image' ? '#7b1fa2' : 'var(--text-muted)';
    }

    private kind(node: TreeNode): 'pdf' | 'image' | 'other' {
        const name = (node.savedFileName || '').toLowerCase();
        const type = (node.fileKind || '').toLowerCase();
        if (type.includes('pdf') || name.endsWith('.pdf')) return 'pdf';
        if (type.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(name)) return 'image';
        return 'other';
    }
}