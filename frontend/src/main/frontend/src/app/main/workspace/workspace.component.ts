import { Component, ViewChild, HostBinding, AfterViewInit, ElementRef, OnInit, Input } from '@angular/core';
import { TdMediaService, TdDialogService } from '@covalent/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WindowRefService } from '../../../services/window-ref.service';
import { AgensApiService } from '../../../services/agens-api.service';
import { DialogsService } from '../../../services/dialogs.service';

import { AgensRequestQuery } from '../../../models/agens-request-query';
import { AgensResponseMetaDb, AgensResponseMetaGraph, AgensResponseMetaLabel } from '../../../models/agens-response-meta';
import { AgensResponseResult, AgensResponseResultMeta, AgensResponseResultQuery } from '../../../models/agens-response-result';

// ** NOTE : 포함하면 AOT 컴파일 오류 떨어짐 (row detail 기능 때문에 사용)
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';

// import { GraphComponent } from '../graph/graph.component';

@Component({
  selector: 'ag-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit, AfterViewInit {

  window:any = null;
  graph_left:any = null;
  graph_left_row:any = null;
  // graph_left_description:string = null;
  graph_right:any = null;
  graph_right_row:any = null;
  // graph_right_description:string = null;
  
  tableRows: any[] = [];
  tableColumns = [
    { name: 'Thumbnail', prop: 'id' },
    { name: 'Title', prop: 'title' },
    { name: 'Description', prop: 'description' },
    { name: 'Last Update', prop: 'update_dt' },
    { name: 'SQL', prop: 'sql' }
  ];

  // ** NOTE : 포함하면 AOT 컴파일 오류 떨어짐 (offset 지정 기능 때문에 사용)
  @ViewChild('projectsTable') projectsTable: any;

  constructor(
    public media: TdMediaService,
    private el: ElementRef,
    private dialogsService: DialogsService,
    private _dialogService: TdDialogService,
    private winRef: WindowRefService,
    private apiSerivce: AgensApiService,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.window = winRef.nativeWindow;    
  }

  ngOnInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
  }

  ngAfterViewInit(): void {
    console.log("WorkspaceComponent.ngAfterViewInit():");

    this.loadAllProjects();

    // AgensGraph Factory
    this.graph_left = this.window.agens.graph.graphFactory(
        this.el.nativeElement.querySelector('div#agens-graph-left')
      );
    // AgensGraph Factory
    this.graph_right = this.window.agens.graph.graphFactory(
        this.el.nativeElement.querySelector('div#agens-graph-right')
      );    

    this.graph_left.resize();
    this.graph_right.resize();
  }

  // Table page event
  onTablePage(pageNumber:number) {
    console.log(`ngx_datatable: pageNumber=${pageNumber}`);
  }
  toggleExpandRow(row) {
    // console.log('Toggled Expand Row!', row);
    this.projectsTable.rowDetail.toggleExpandRow(row);
  }
  onRowDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }

  loadAllProjects(): void {
    this.apiSerivce.dbProjects()
      .then(data => {
        this.tableRows = data;
      });
  }

  showProjectGraph(where:string, row:any){
    this.clearGraph(where);
    if( where == 'left' ){
      this.graph_left_row = row;
    }
    else{
      this.graph_right_row = row;
    }
    this.apiSerivce.dbProjectGraph(row.id)
      .then(data => {
        // console.log( data );
        if( where == 'left' ){
          this.graph_left.json( data );
          this.graph_left.fit( this.graph_left.elements(), 50 );    
          this.graph_left.resize();
        }
        else{
          this.graph_right.json( data );
          this.graph_right.fit( this.graph_right.elements(), 50 );    
          this.graph_right.resize();          
        }
      });
  }

  clearGraph(where:string){
    if( where == 'left' ){
      this.graph_left.elements().remove();
      this.graph_left.style( this.window.agens.graph.defaultStyle );
      this.graph_left_row = null;
      this.graph_left.resize();
    }
    else{
      this.graph_right.elements().remove();
      this.graph_right.style( this.window.agens.graph.defaultStyle );
      this.graph_right_row = null;
      this.graph_right.resize();
    }
  }

  goEditGraph(where:string){
    let row:any;
    if( where == 'left' ) row = this.graph_left_row;
    else row = this.graph_right_row;

    if( row == null ) return;
    this.router.navigate([`/graph/${row.id}`, row]);
  }

  // **NOTE: 마우스의 실제 클릭 위치가 canvas와 다를 때, 교정해준다
  cyResize(where:string){
    if( where == 'left' ) this.graph_left.resize();
    else this.graph_right.resize();
  }

}
