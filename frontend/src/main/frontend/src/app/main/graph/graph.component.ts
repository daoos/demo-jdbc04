import { Component, ViewChild, HostBinding, AfterViewInit, ElementRef, OnInit, Input, OnDestroy, AfterContentChecked } from '@angular/core';
import { TdMediaService, TdDialogService } from '@covalent/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { WindowRefService } from '../../../services/window-ref.service';
import { AgensApiService } from '../../../services/agens-api.service';
import { DialogsService } from '../../../services/dialogs.service';

import { AgensRequestQuery } from '../../../models/agens-request-query';
import { AgensResponseMetaDb, AgensResponseMetaGraph, AgensResponseMetaLabel } from '../../../models/agens-response-meta';
import { AgensResponseResult, AgensResponseResultMeta, AgensResponseResultQuery } from '../../../models/agens-response-result';

// ** NOTE : 포함하면 AOT 컴파일 오류 떨어짐 (row detail 기능 때문에 사용)
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';


declare var $: any;
declare var CodeMirror: any;

@Component({
  selector: 'ag-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class GraphComponent implements AfterViewInit, OnInit, OnDestroy /*, AfterContentChecked */ {
  
  private route$ : Subscription;
  public project : any = null;

  window:any = null;
  graph:any = null;

  metaData: AgensResponseMetaDb = null;

  result:AgensResponseResult = null;  
  result_json:any = {};
  result_json_expand:boolean = false;
  result_table_expand:boolean = false;
  result_table_rows:any[] = [];
  result_table_columns: any[] = [];
  result_labels:any[] = [];

  loading:boolean = false;
  loading_table:boolean = false;

  query:string =
`match path=(a:production {'title': 'Haunted House'})-[]-(b:company) 
return path 
limit 10
`;
  
  title: string = "No title"
  editor: any;
  editorRef: any;

  toggleDivSave: boolean = false;
  projId: number = 0;
  projTitle: string = "";
  projDescription: string = "";

  // ** NOTE : 포함하면 AOT 컴파일 오류 떨어짐 (offset 지정 기능 때문에 사용)
  @ViewChild('resultTable') resultTable: any;

  constructor(
    public media: TdMediaService,
    private el: ElementRef,
    private dialogsService: DialogsService,
    private _dialogService: TdDialogService,
    private winRef: WindowRefService,
    private apiSerivce: AgensApiService,
    private _route : ActivatedRoute,
    private router : Router
  ) {
    this.window = winRef.nativeWindow;    
  }

  ngOnInit(): void { 
    // console.log("GraphComponent.ngOnInit():");
    this.media.broadcast(); 

    this.apiSerivce.setFunction( this.checkLoadProject );
  }

  ngAfterViewInit(): void {
    console.log("GraphComponent.ngAfterViewInit():");

    // broadcast to all listener observables when loading the page
    this.media.broadcast();

    this.toggleDivSave = false;

    // CodeMirror Editor
    this.editorRef = this.el.nativeElement.querySelector('textarea#agensQuery');
    // get mime type
    var mime = 'application/x-cypher-query';
    this.editor = CodeMirror.fromTextArea( this.editorRef, {
      mode: mime,
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets : true,
      autofocus: true,
      theme: 'eclipse'
    });

    // AgensGraph Factory
    this.graph = this.window.agens.graph.graphFactory(
        this.el.nativeElement.querySelector('div#agens-graph')
      );
      
    // Cytoscape의 canvas가 영역을 전부 덮어버리기 때문에, zIndex 우선순위를 올려야 함
    this.el.nativeElement.querySelector('span#agens-graph-toolbar').style.zIndex = "9";
    // this.el.nativeElement.querySelector('md-chip-list#agens-graph-labels').style.zIndex = "9";

    if( this._route.snapshot.params.hasOwnProperty('id') ){
      console.log( `load AgensProject[${this._route.snapshot.params.id}]:`);
      this.checkLoadProject();
    }
  }

  ngOnDestroy() {
    if(this.route$) this.route$.unsubscribe();
  }

  // ngAfterContentChecked(){
  //   console.log("GraphComponent.ngAfterContentChecked():");    
  // }

  // save를 위한 입력 div
  toggleSave(){
    this.toggleDivSave = !this.toggleDivSave;
  }

  loadDemoData(index){
    if( this.window.agens.graph === undefined || this.graph === undefined ) return;
    console.log( `load SampleData(${index})` );

    // for TEST
    this.window.agens.graph.loadData( this.window.agens.graph.demoData[index] );
    // md-chip TEST
    this.result_labels = this.getLabels( this.window.agens.graph.demoData[index] );
  }

  // cytoscape makeLayout & run
  changeLayout(index){
    if( this.window.agens.graph === undefined || this.graph === undefined ) return;
    let selectedLayout = this.window.agens.graph.layoutTypes[Number(index)];
    console.log( "change layout : "+selectedLayout.name );

    var layout = this.graph.makeLayout(selectedLayout);
    layout.run();
    this.graph.fit( this.graph.elements(), 50 ); // fit to all the layouts    
  }

  // request query to server
  requestQuery(){
    let sql:string = String(this.editor.getValue());
    console.log( "** SQL: \n"+sql );
    this.loading = true;
    this.clearGraph();
    
    let query:AgensRequestQuery = new AgensRequestQuery( sql );
    this.apiSerivce.dbQuery(query)
      .then(data => {
        console.log( "requestQuery(): new AgensResponseResult" );
        this.result = new AgensResponseResult(data);
        console.log( "requestQuery(): setResultTable" );
        this.setResultTable(this.result);
        this.result_table_expand = true;

        console.log( "requestQuery(): getCyElements" );
        let eles = this.result.getCyElements();
        this.window.agens.graph.loadData( eles );
        this.result_labels = this.getLabels( eles );

        this.loading = false;

        console.log( "requestQuery(): setResultJson" );
        // 이것 때문에 테이블의 데이터가 비정상적으로 표시됨 (이유 모름)
        this.setResultJson(this.result);  
      });
  }

  getLabels( eles:any ):any[] {
    let labels = new Map<string,any>();
    for( let item of eles['nodes'] ){
      if( labels.has(item.data.label) ) labels.get(item.data.label).count += 1;
      else {
        labels.set(item.data.label, { name: item.data.label, type: 'vertex', count: 1 });
      }
    }
    for( let item of eles['edges'] ){
      if( labels.has(item.data.label) ) labels.get(item.data.label).count += 1;
      else {
        labels.set(item.data.label, { name: item.data.label, type: 'edge', count: 1 });
      }
    }
    let labelArray:any[] = [];
    for( let key of Array.from(labels.keys()) ){
      labelArray.push(labels.get(key) );
    }
    return labelArray;
  }

  setResultJson( result:AgensResponseResult ){
    let temp:string = JSON.stringify( result.getRows() );
    this.result_json = JSON.parse( temp );
    // console.log(this.result_json);
  }
  setResultTable( result:AgensResponseResult ){
    this.result_table_columns = result.getTableColumns();
    this.result_table_rows = result.getTableRows();
    this.resultTable.offset = 0;
  }

  // Table page event
  onTablePage(pageNumber:number) {
    console.log(`ngx_datatable: pageNumber=${pageNumber}`);
  }
  toggleExpandRow(row, col) {
    // console.log('Toggled Expand Row!', row, col);
    row._selectedColumn = col;
    this.resultTable.rowDetail.toggleExpandRow(row);
  }
  onRowDetailToggle(event) {
    // console.log('Detail Toggled', event);   // type=row, value={row}
  }

  clearGraph(){
    this.graph.elements().remove();
    this.graph.style( this.window.agens.graph.defaultStyle );

    this.result = null;
    this.result_json = {};
    this.result_json_expand = false;
    this.result_table_expand = false;
    this.result_table_columns = [];
    this.result_table_rows = [];
    this.result_labels = [];
  }

  newGraph() {
    if( this.graph === undefined ) return;
    this.clearGraph();
  }

  dlgExportImage(){
    if( this.window.agens.dialog === undefined ) return;
    this.window.agens.dialog.openImageExport();
  }

  dlgExportJson(){
    if( this.window.agens.dialog === undefined ) return;
    this.window.agens.dialog.openJsonExport();
  }
  
  dlgFullScreen(){
    if( this.graph === undefined ) return;
    this.dialogsService.dlgFullScreenGraph( this.graph.json() );
  }

  cyUndo(): void{
    if( this.window.agens.api.unre === undefined ) return;
    this.window.agens.api.unre.undo();
  }
  cyRedo(): void{
    if( this.window.agens.api.unre === undefined ) return;
    this.window.agens.api.unre.redo();
  }
  cySelectLabel( labelType, labelName ){
    console.log(`clicked md-chip: label('${labelType}', '${labelName}')`);
    this.graph.elements(':selected').unselect();
    let type:string = (labelType == 'vertex') ? 'node' : 'edge';
    this.graph.elements(`${type}[label='${labelName}']`).select();
  }

  saveProject(): void {
    let user = this.apiSerivce.dbUser();
    if( user == null ) return;

    let sql:string = String(this.editor.getValue()).trim();
    console.log( `** SAVE[${user.user_id}]: \n`+sql );
    
    let thumbnail = this.graph.png({scale : 3, full : true, bg: 'white', maxWidth: '200px', maxHeight: '100px'});

    let project:any = {
      "username": user.user_id,
      "title": this.projTitle,
      "description": this.projDescription,
      "sql": sql,
      "graph": JSON.stringify(this.graph.json()),
//      "image": String(thumbnail)
    };
    if( !!this.projId && this.projId > 0 ) project['id'] = this.projId;

    this.apiSerivce.dbSaveProject(project)
      .then(data => {
        // console.log(data);
      });
    this.toggleSave();
  }

  loadProjectGraph(projId:number){
  }

  public checkLoadProject(): void {
    console.log( "checkLoadProject():" );
    // console.log( this.route.params );

    this.route$ = this._route.params.subscribe(
        params => {
          if( params.hasOwnProperty('id') && params.id > 0 ){
            // console.log(params);
            this.project = params;
            this.loading = true;
          }
          else{
            this.project = null;
            return;
          }

          this.clearGraph();

          this.projId = this.project.id;
          this.projTitle = this.project.title;
          this.projDescription = this.project.description;
          this.editor.getDoc().setValue( this.project.sql );
          this.apiSerivce.dbProjectGraph(this.projId )
            .then(data => {
              // console.log( data );
              if( data !== null ){
                this.graph.json( data );
                this.graph.fit( this.graph.elements(), 50 );    
                this.graph.resize();
              }
              this.loading = false;
            });
        }
    );    
  }

  // **NOTE: 마우스의 실제 클릭 위치가 canvas와 다를 때, 교정해준다
  cyResize(){
    this.graph.resize();
  }  
}
