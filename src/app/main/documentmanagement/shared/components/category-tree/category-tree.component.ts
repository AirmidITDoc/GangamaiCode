import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Category } from 'app/core/models/documentmanagement/category.model';

@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.scss'],
})
export class CategoryTreeComponent implements OnChanges {
  @Input() nodes: Category[] = [];
  @Input() manageable = false;
  @Input() selectable = true;
  @Input() selectedId: string | null = null;
  @Input() expandAll = false;

  @Output() select = new EventEmitter<string>();
  @Output() addChild = new EventEmitter<string | null>();
  @Output() rename = new EventEmitter<{ id: string; name: string }>();
  @Output() remove = new EventEmitter<string>();

  treeControl = new NestedTreeControl<Category>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<Category>();

  editingId: string | null = null;
  editValue = '';

  ngOnChanges(): void {
    this.dataSource.data = this.nodes;
    if (this.expandAll) {
      queueMicrotask(() => this.expandAllNodes(this.nodes));
    }
  }

  private expandAllNodes(nodes: Category[]): void {
    for (const n of nodes) {
      this.treeControl.expand(n);
      if (n.children?.length) this.expandAllNodes(n.children);
    }
  }

  hasChild = (_: number, node: Category): boolean => !!node.children && node.children.length > 0;

  onSelect(node: Category): void {
    if (!this.selectable) return;
    this.select.emit(node.id);
  }

  startEdit(node: Category): void {
    this.editingId = node.id;
    this.editValue = node.name;
  }

  confirmEdit(node: Category): void {
    if (this.editValue.trim()) {
      this.rename.emit({ id: node.id, name: this.editValue.trim() });
    }
    this.editingId = null;
  }

  cancelEdit(): void {
    this.editingId = null;
  }
}
