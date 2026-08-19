import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryFormDialogComponent, CategoryFormResult } from './category-form-dialog.component';
import { DocumentCategory } from 'app/core/models/documentmanagement/category.model';
import { MockDataService } from '../mock-data.service';
import { DocumentmanagementService } from '../documentmanagement.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
    categories: DocumentCategory[] = [];
    selectedId: number | null = null;

    constructor(
        private data: MockDataService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private _service: DocumentmanagementService
    ) {
        // this.data.categories$.subscribe((tree) => {
        //     this.categories = tree;
        //     this.computeStats(tree);
        // });
        this.bindCategories();
    }
    bindCategories() {
        this._service.getCategoryTree().subscribe((res) => {
            debugger
            this.categories = res;
        })
    }

    openAddDialog(parentId: any): void {
        debugger
        if (parentId.mode == 'delete') {
            this.onDelete(parentId.id);
        }
        else {
            const parentName = parentId.id ? this.data.findNode(this.categories, parentId.id)?.docCategory ?? null : null;
            const ref = this.dialog.open(CategoryFormDialogComponent, { data: { parentName, parentId: parentId.id, mode: parentId.mode } });
            ref.afterClosed().subscribe((result: CategoryFormResult | undefined) => {
                if (!result) return;
                this.bindCategories();
                this.snackBar.open(`Added "${result.name}"`, 'Dismiss', { duration: 2500 });
            });
        }
    }
    onDelete(id) {
        const ref = this.dialog.open(FuseConfirmDialogComponent, { disableClose: false, });
        ref.componentInstance.confirmMessage = "Are you sure you want to delete this document category?";
        ref.afterClosed().subscribe((result) => {
            if (result) {
                this._service.deleteCategory(id).subscribe((res) => {
                    this.bindCategories();
                });
            }
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
