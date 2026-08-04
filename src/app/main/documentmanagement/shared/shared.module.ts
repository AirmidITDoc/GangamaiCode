import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';
import { FileKindIconPipe, FileKindLabelPipe } from './pipes/file-kind.pipe';
import { FileSizePipe } from './pipes/file-size.pipe';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { CategoryTreeComponent } from './components/category-tree/category-tree.component';
import { PreviewDialogComponent } from './components/preview-dialog/preview-dialog.component';

@NgModule({
  declarations: [
    FileKindIconPipe,
    FileKindLabelPipe,
    FileSizePipe,
    PageHeaderComponent,
    CategoryTreeComponent,
    PreviewDialogComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MaterialModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    FileKindIconPipe,
    FileKindLabelPipe,
    FileSizePipe,
    PageHeaderComponent,
    CategoryTreeComponent,
    PreviewDialogComponent,
  ],
})
export class SharedModule {}
