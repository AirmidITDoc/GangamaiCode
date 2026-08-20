import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DocumentCategory } from 'app/core/models/documentmanagement/category.model';
import { DocumentmanagementService } from '../documentmanagement.service';
import { CategoryFormDialogComponent, CategoryFormResult } from './category-form-dialog.component';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
    categories: DocumentCategory[] = [];
    selectedId: number | null = null;

    constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private _service: DocumentmanagementService) {
        this.bindCategories();
    }
    bindCategories() {
        this._service.getCategoryTree().subscribe((res) => {
            this.categories = res;
        })
    }

    openAddDialog(parentId: any): void {
        if (parentId.mode == 'delete') {
            this.onDelete(parentId.id);
        }
        else {
            const parentName = parentId.id ? this.findNode(this.categories, parentId.id)?.docCategory ?? null : null;
            const ref = this.dialog.open(CategoryFormDialogComponent, { data: { parentName, parentId: parentId.id, mode: parentId.mode } });
            ref.afterClosed().subscribe((result: CategoryFormResult | undefined) => {
                if (!result) return;
                this.bindCategories();
                this.snackBar.open(`Added "${result.name}"`, 'Dismiss', { duration: 2500 });
            });
        }
    }
    findNode(list: DocumentCategory[], id: number): DocumentCategory | null {
        for (const node of list) {
            if (node.id === id) return node;
            const found = this.findNode(node.children, id);
            if (found) return found;
        }
        return null;
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

    onSelect(id: number): void {
        this.selectedId = id;
    }
}