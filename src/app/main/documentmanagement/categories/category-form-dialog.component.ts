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
        @Inject(MAT_DIALOG_DATA) public data: { parentName: string | null, parentId: number | null, mode: string }
    ) { }
    ngOnInit(): void {
        this.categoryForm = this._service.createCategoryFrom();
        this.categoryForm.markAllAsTouched();
        if (this.data.mode == 'edit') {
            this._service.getCategory(this.data.parentId).subscribe((res) => {
                this.categoryForm.controls["icon"].setValue(res.icon);
                this.categoryForm.controls["docCategory"].setValue(res.docCategory);
                this.categoryForm.controls["parentId"].setValue(res.parentId);
                this.categoryForm.controls["id"].setValue(res.id);
                this.icon=res.icon;
            });;
        }
    }
    submit(): void {
        if (!this.categoryForm.invalid) {
            this.categoryForm.controls["icon"].setValue(this.icon);
            if (this.data.parentId > 0 && this.data.mode == 'add')
                this.categoryForm.controls["parentId"].setValue(this.data.parentId);
            this._service.saveCategory(this.categoryForm.value).subscribe((res) => {
                this.dialogRef.close(res);
            })
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }
}