import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'ag-full-screen-graph',
  templateUrl: './full-screen-graph.component.html',
  styleUrls: ['./full-screen-graph.component.scss']
})
export class FullScreenGraphComponent implements OnInit {

  graphJson: any = {};
  
  constructor(
    private dialogRef: MdDialogRef<FullScreenGraphComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
