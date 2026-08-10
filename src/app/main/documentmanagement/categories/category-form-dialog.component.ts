import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentmanagementService } from '../documentmanagement.service';
import { DocumentCategory } from 'app/core/models/documentmanagement/category.model';

export interface CategoryFormResult {
    name: string;
    icon: string;
}

@Component({
    selector: 'app-category-form-dialog',
    templateUrl: './category-form-dialog.component.html',
    styleUrls: ['./category-form-dialog.component.scss'],
})
export class CategoryFormDialogComponent {
    name = '';
    icon = 'folder';
    iconChoices = ['folder', 'folder_special', 'description', 'assignment_ind', 'account_balance', 'fact_check', 'edit_document', 'radiology', 'checklist', 'healing', 'gavel', 'accessibility_new', 'note', 'library_books', 'menu_book', 'book', 'receipt_long', 'verified_user', 'medical_information', 'work', 'business', 'school', 'home'];
    categoryForm: FormGroup;
    obj: DocumentCategory = { id: 0, parentId: null, docCategory: '', children: [], documentCount: 0, icon: null };
    constructor(
        public dialogRef: MatDialogRef<CategoryFormDialogComponent>, public _service: DocumentmanagementService,
        @Inject(MAT_DIALOG_DATA) public data: { parentName: string | null }
    ) { }
    ngOnInit(): void {
        this.categoryForm = this._service.createCategoryFrom();
        this.categoryForm.markAllAsTouched();
    }
    submit(): void {
        if (!this.name.trim()) return;
        const result: CategoryFormResult = { name: this.name.trim(), icon: this.icon };
        this.dialogRef.close(result);
    }

    cancel(): void {
        this.dialogRef.close();
    }
}