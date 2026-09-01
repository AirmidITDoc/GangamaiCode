import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileKind, DocumentFileModel } from 'app/core/models/documentmanagement/document.model';
import { DocumentCategory } from 'app/core/models/documentmanagement/category.model';
import { MockDataService } from '../mock-data.service';
import { ZipService } from '../zip.service';
import { PreviewDialogComponent } from '../shared/components/preview-dialog/preview-dialog.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  allDocuments: DocumentFileModel[] = [];
  categories: DocumentCategory[] = [];

  searchTerm = '';
  activeKind: FileKind | 'all' = 'all';
  activeCategoryId: string | null = null;
  view: 'grid' | 'list' = 'grid';

  pageIndex = 0;
  pageSize = 9;

  kindFilters: { value: FileKind | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All types', icon: 'apps' },
    { value: 'pdf', label: 'PDF', icon: 'picture_as_pdf' },
    { value: 'image', label: 'Image', icon: 'image' },
    { value: 'doc', label: 'Word', icon: 'description' },
    { value: 'xls', label: 'Sheet', icon: 'table_chart' },
  ];

  constructor(
    private data: MockDataService,
    private zipService: ZipService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.data.documents$.subscribe((docs) => (this.allDocuments = docs));
    this.data.categories$.subscribe((cats) => (this.categories = cats));
    this.route.queryParamMap.subscribe((params) => {
      const q = params.get('q');
      if (q) this.searchTerm = q;
    });
  }

  get filtered(): DocumentFileModel[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.allDocuments.filter((d) => {
      const matchesTerm =
        !term ||
        d.savedFileName.toLowerCase().includes(term) ||
        d.admissionId.toString().toLowerCase().includes(term) ||
        d.fileTags.split(',').some((t) => t.toLowerCase().includes(term));
      return matchesTerm;
    });
  }

  get paged(): DocumentFileModel[] {
    const start = this.pageIndex * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearchChange(): void {
    this.pageIndex = 0;
  }

  onKindChange(k: FileKind | 'all'): void {
    this.activeKind = k;
    this.pageIndex = 0;
  }

  onCategorySelect(id: string): void {
    this.activeCategoryId = this.activeCategoryId === id ? null : id;
    this.pageIndex = 0;
  }

  clearCategory(): void {
    this.activeCategoryId = null;
  }

  onPage(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  preview(doc: DocumentFileModel): void {
    this.dialog.open(PreviewDialogComponent, { data: doc, maxWidth: '95vw' });
  }

  download(doc: DocumentFileModel): void {
    this.zipService.downloadSingleDocument(doc);
    this.snackBar.open(`Downloading ${doc.savedFileName}`, 'Dismiss', { duration: 2000 });
  }

  remove(doc: DocumentFileModel): void {
    if (!confirm(`Delete "${doc.orgFileName}"? This cannot be undone.`)) return;
    this.data.deleteDocument(doc.id.toString());
    this.snackBar.open('Document deleted', 'Dismiss', { duration: 2000 });
  }

  categoryLabel(id: number | null): string {
    if (!id) return '';
    const match = this.data.getAllPaths().find((p) => p.id === id);
    return match ? match.path.join(' / ') : '';
  }
}
