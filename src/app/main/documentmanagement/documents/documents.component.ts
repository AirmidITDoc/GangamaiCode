import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileKind, HospitalDocument } from 'app/core/models/documentmanagement/document.model';
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
  allDocuments: HospitalDocument[] = [];
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

  get filtered(): HospitalDocument[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.allDocuments.filter((d) => {
      const matchesTerm =
        !term ||
        d.title.toLowerCase().includes(term) ||
        d.patientName.toLowerCase().includes(term) ||
        d.patientId.toString().toLowerCase().includes(term) ||
        d.tags.some((t) => t.toLowerCase().includes(term)) ||
        d.categoryPath.join(' ').toLowerCase().includes(term);
      const matchesKind = this.activeKind === 'all' || d.fileKind === this.activeKind;
      const matchesCategory = !this.activeCategoryId || d.categoryId === this.activeCategoryId;
      return matchesTerm && matchesKind && matchesCategory;
    });
  }

  get paged(): HospitalDocument[] {
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

  preview(doc: HospitalDocument): void {
    this.dialog.open(PreviewDialogComponent, { data: doc, maxWidth: '95vw' });
  }

  download(doc: HospitalDocument): void {
    this.zipService.downloadSingleDocument(doc);
    this.snackBar.open(`Downloading ${doc.fileName}`, 'Dismiss', { duration: 2000 });
  }

  remove(doc: HospitalDocument): void {
    if (!confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    this.data.deleteDocument(doc.id);
    this.snackBar.open('Document deleted', 'Dismiss', { duration: 2000 });
  }

  categoryLabel(id: number | null): string {
    if (!id) return '';
    const match = this.data.getAllPaths().find((p) => p.id === id);
    return match ? match.path.join(' / ') : '';
  }
}
