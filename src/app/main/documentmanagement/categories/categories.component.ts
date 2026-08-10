import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryFormDialogComponent, CategoryFormResult } from './category-form-dialog.component';
import { DocumentCategory } from 'app/core/models/documentmanagement/category.model';
import { MockDataService } from '../mock-data.service';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
    categories: DocumentCategory[] = [];
    selectedId: number | null = null;
    totalNodes = 0;
    maxDepth = 0;

    constructor(
        private data: MockDataService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {
        this.data.categories$.subscribe((tree) => {
            this.categories = tree;
            this.computeStats(tree);
        });
    }

    private computeStats(tree: DocumentCategory[]): void {
        let count = 0;
        let depth = 0;
        const walk = (nodes: DocumentCategory[], level: number) => {
            depth = Math.max(depth, level);
            for (const n of nodes) {
                count += 1;
                if (n.children.length) walk(n.children, level + 1);
            }
        };
        walk(tree, 1);
        this.totalNodes = count;
        this.maxDepth = depth;
    }

    openAddDialog(parentId: number | null): void {
        const parentName = parentId ? this.data.findNode(this.categories, parentId)?.docCategory ?? null : null;
        const ref = this.dialog.open(CategoryFormDialogComponent, { data: { parentName } });
        ref.afterClosed().subscribe((result: CategoryFormResult | undefined) => {
            if (!result) return;
            this.data.addCategory(parentId, result.name, result.icon);
            this.snackBar.open(`Added "${result.name}"`, 'Dismiss', { duration: 2500 });
        });
    }

    onRename(evt: { id: number; name: string }): void {
        this.data.renameCategory(evt.id, evt.name);
        this.snackBar.open('Category renamed', 'Dismiss', { duration: 2000 });
    }

    onRemove(id: number): void {
        const node = this.data.findNode(this.categories, id);
        this.data.deleteCategory(id);
        this.snackBar.open(`Deleted "${node?.docCategory ?? 'category'}" and its sub-categories`, 'Dismiss', { duration: 3000 });
        if (this.selectedId === id) this.selectedId = null;
    }

    onSelect(id: number): void {
        this.selectedId = id;
    }

    get selectedPath(): string {
        if (!this.selectedId) return '';
        const match = this.data.getAllPaths().find((p) => p.id === this.selectedId);
        return match ? match.path.join(' / ') : '';
    }
}
