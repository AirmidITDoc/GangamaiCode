import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { DocumentCategory } from 'app/core/models/documentmanagement/category.model';

@Component({
    selector: 'app-category-tree',
    templateUrl: './category-tree.component.html',
    styleUrls: ['./category-tree.component.scss'],
})
export class CategoryTreeComponent implements OnChanges {
    @Input() nodes: DocumentCategory[] = [];
    @Input() manageable = false;
    @Input() selectable = true;
    @Input() selectedId: string | null = null;
    @Input() expandAll = false;

    @Output() select = new EventEmitter<number>();
    @Output() addChild = new EventEmitter<any>();

    treeControl = new NestedTreeControl<DocumentCategory>((node) => node.children);
    dataSource = new MatTreeNestedDataSource<DocumentCategory>();

    ngOnChanges(): void {
        this.dataSource.data = this.nodes;
        if (this.expandAll) {
            queueMicrotask(() => this.expandAllNodes(this.nodes));
        }
    }

    private expandAllNodes(nodes: DocumentCategory[]): void {
        for (const n of nodes) {
            this.treeControl.expand(n);
            if (n.children?.length) this.expandAllNodes(n.children);
        }
    }

    hasChild = (_: number, node: DocumentCategory): boolean => !!node.children && node.children.length > 0;

    onSelect(node: DocumentCategory): void {
        if (!this.selectable) return;
        this.select.emit(node.id);
    }

}
