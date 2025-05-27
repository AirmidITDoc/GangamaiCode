import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Appointment Date',
    children: [
      {name: 'Appointment Date 1:01/01/2023'},
      {name: 'Appointment Date 2:15/01/2023'},
      {name: 'Appointment Date 3:30/01/2023'},
      {name: 'Appointment Date 4:15/02/2023'},
    ]
  }
  
];


/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-schdule-tree',
  templateUrl: './schdule-tree.component.html',
  styleUrls: ['./schdule-tree.component.scss']
})
export class SchduleTreeComponent implements OnInit {

  private transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }
  ngOnInit(): void {}

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}


