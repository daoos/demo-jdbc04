import { Component, ViewChild , OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { TdMediaService, TdDialogService } from '@covalent/core';
import { Router } from '@angular/router';

import * as GlobalConfig from '../../global.config';
import { AgensApiService } from '../../../services/agens-api.service';
import { AgensResponseMetaDb, AgensResponseMetaGraph, AgensResponseMetaLabel } from '../../../models/agens-response-meta';
import { AgensRequestLabel } from '../../../models/agens-request-label';

// ** NOTE : 포함하면 AOT 컴파일 오류 떨어짐 (offset 지정 기능 때문에 사용)
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';

@Component({
  selector: 'ag-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {

  host: string;
  port: string;
  db: string;
  db_owner: string;
  db_desc: string;
  username: string;
  email: string;
  authorities: string;

  metaData: AgensResponseMetaDb = null;
  treeData: any[] = [];
  tableRows: any[] = [];
  tableColumns = [
    { name: 'OID', prop: 'id' },
    { name: 'Name', prop: 'name' },
    { name: 'Type', prop: 'type' },
    { name: 'Owner', prop: 'owner' },
    { name: 'Description', prop: 'desc' }
  ];

  loading:boolean = false;
  loading_label:boolean = false;

  // ** NOTE : 포함하면 AOT 컴파일 오류 떨어짐 (offset 지정 기능 때문에 사용)
  @ViewChild('browserTable') browserTable: DatatableComponent;

  constructor(
    public media: TdMediaService,
    private el: ElementRef,
    private _dialogService: TdDialogService,
    private apiSerivce: AgensApiService
  ) { }

  ngOnInit(): void { 
    // console.log("DashboardComponent.ngOnInit():");
  }

  ngAfterViewInit(): void {    
    // console.log("DashboardComponent.ngAfterViewInit():");    
    let user:any = this.apiSerivce.dbUser();
    if (user) {
        if(user.host) this.host = user.host;
        if(user.port) this.port = user.port;
        if(user.db) this.db = String(user.db).toUpperCase();
        if(user.username) this.username = String(user.username).toUpperCase();
        if(user.email) this.email = user.email;
        if(user.authorities) this.authorities = user.authorities.join(', ');
    }

    // broadcast to all listener observables when loading the page
    this.media.broadcast();

    // display metaData to treeData
    this.loadMetaData();
  }

  // call API: db
  loadMetaData(){

    // for TEST
    if( !GlobalConfig.DEV_MODE ){
      this.loading = true;
      this.apiSerivce.dbMeta()
        .then(data => {
          this.metaData = new AgensResponseMetaDb(data);
          this.db_owner = this.metaData.owner;
          this.db_desc = this.metaData.desc;

          this.treeData = [ this.metaData.toTreeData() ];
          this.loading = false;
        });
    }
    else{
      // TEST using json file
      const req = new XMLHttpRequest();
      req.open('GET', `data/demo-meta.json`);
      req.onload = () => {
        this.metaData = new AgensResponseMetaDb( JSON.parse(req.response) );
        this.db_owner = this.metaData.owner;
        this.db_desc = this.metaData.desc;

        this.treeData = [ this.metaData.toTreeData() ];
        this.loading = false;
      };
      req.send();
    }
  }

  // Tree initialize event   
  onTreeInitialized(event){
    event.treeModel.expandAll();
    let root = event.treeModel.getFirstRoot();
    event.treeModel.setFocusedNode( root );
    if( !root.isLeaf && root.data.children ){
      this.tableRows = root.data.children;
    }
  }
  // Tree focus event
  onTreeActivate(tree, event) {
    //console.log( `click Node(${tree.treeModel.focusedNode.data.name}): level=${tree.treeModel.focusedNode.level}` );
    if( !tree.treeModel.focusedNode.isLeaf && tree.treeModel.focusedNode.level != 2
        && tree.treeModel.focusedNode.data.children ){
      this.tableRows = tree.treeModel.focusedNode.data.children;
    }
    // call API : getLabelMeta()
    if( tree.treeModel.focusedNode.isLeaf && tree.treeModel.focusedNode.level == 4 ){
      let graph = tree.treeModel.focusedNode.data.graph;
      let type = tree.treeModel.focusedNode.data.type;
      let name = tree.treeModel.focusedNode.data.label;

      this.loading_label = true;
      let label:AgensResponseMetaLabel = this.metaData.findLabel(graph, type, name);
      if( label ){
        if( !label.loaded_properties ){
          this.apiSerivce.dbLabel( new AgensRequestLabel(graph, type, name ))
            .then( data => {
              label.setProperties(data);
              this.tableRows = label.toTreeDetails();
              // ** NOTE: ngx-datatable에 offset 이 초기화 안되는 버그 있음
              this.browserTable.offset = 0;

              tree.treeModel.focusedNode.data.loaded = true;
              this.loading_label = false;
            });
        }
        else{
          this.tableRows = label.toTreeDetails();
          // ** NOTE: ngx-datatable에 offset 이 초기화 안되는 버그 있음
          this.browserTable.offset = 0;

          this.loading_label = false;
        }          
      }        
    }    
  }

  // Table page event
  onTablePage(pageNumber:number) {
    console.log("ngx_datatable: pageNumber="+pageNumber);
  }

}
