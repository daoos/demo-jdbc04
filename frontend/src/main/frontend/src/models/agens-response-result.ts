import { AgensTypePath, AgensTypeVertex, AgensTypeEdge, AgensTypeJsonb } from './agens-data-types';

export class AgensResponseResult {

  query: AgensResponseResultQuery = null;
  meta: AgensResponseResultMeta[] = [];
  rows: any[] = [];
  size: number;
  message: string;
  finishTime: number;

  constructor( data:any ){
    if( data.hasOwnProperty('query')) this.query = new AgensResponseResultQuery(data.query);
    if( data.hasOwnProperty('meta')) {
      let idx:number = 0;
      for( let item of data['meta'] ){
        this.meta.push( new AgensResponseResultMeta( idx, item) );
        idx += 1;
      }
    }
    if( data.hasOwnProperty('rows')) {
      for( let item of data['rows'] ){
        this.rows.push( this.parseRow(item) );
      }
    }
    if( data.hasOwnProperty('size')) this.size = data.size;
    if( data.hasOwnProperty('message')) this.message = data.message;
    if( data.hasOwnProperty('finishTime')) this.finishTime = data.finishTime;
  }

  private parseRow(data:any[]){
    let row:any = {};

    for( let col of this.meta ){
      switch( col.type ){
        case 'graphpath': {
          let elem:AgensTypePath = new AgensTypePath( data[col.idx] );
          row[col.name] = elem;
          break;
        }
        case 'vertex': {
          let elem:AgensTypeVertex = new AgensTypeVertex( data[col.idx] );
          row[col.name] = elem;
          break;
        }
        case 'edge': {
          let elem:AgensTypeEdge = new AgensTypeEdge( data[col.idx] );
          row[col.name] = elem;
          break;
        }
        case 'jsonb': {
          let elem:AgensTypeJsonb = new AgensTypeJsonb( data[col.idx] );
          row[col.name] = elem;
          break;
        }
        case 'number': {
          let elem:number = Number(data[col.idx]);
          row[col.name] = elem;
          break;
        }
        case 'string': {
          let elem:string = String(data[col.idx]);
          row[col.name] = elem;
          break;
        }
        case 'object':
        default: {
          let elem:any = data[col.idx];
          row[col.name] = elem;
          break;
        }
      }
    }
    return row;
  }

  public getRows() {
    return this.rows;
  }
  public getMeta() {
    return this.meta;
  }
  public getQuery(){
    return this.query;
  }

  public getCyElements():any {
    let eles:any = {
      nodes: [],
      edges: []
    };

    for( let row of this.rows ){
      for( let col of this.meta ){
        switch( col.type ){
          case 'graphpath': {
            let path:AgensTypePath = row[col.name];
            eles.nodes = eles.nodes.concat( path.toNodes() );
            eles.edges = eles.edges.concat( path.toEdges() );
            break;
          }
          case 'vertex': {
            let vertex:AgensTypeVertex = row[col.name];
            eles.nodes.push( vertex.toNode() );
            break;
          }
          case 'edge': {
            let edge:AgensTypeEdge = row[col.name];
            eles.edges.push( edge.toEdge() );
            break;
          }
        }
      }
    }  
    return eles;
  }

  public getTableColumns():any[] {
    let columns:any[] = [];
    for( let col of this.meta ) columns.push( col.toTableColumn() );
    return columns;
  }
  public getTableRows():any[] {
    let tableRows:any[] = [];
    for( let row of this.rows ){
      let tableRow:any = {};
      for( let col of this.meta ){
        switch( col.type ){
          case 'graphpath':
          case 'vertex':
          case 'edge':
          case 'jsonb': {
            tableRow[col.name] = row[col.name].toTableData();
            break;
          }
          default: {
            tableRow[col.name] = row[col.name];
            break;
          }
        }
      }
      tableRows.push(tableRow);
    }
    return tableRows;
  }

};

export class AgensResponseResultQuery {

  sessionId: string;
  requestId: number;
  requestTime: number;
  sql: string;

  constructor( data:any ){
    if( data.hasOwnProperty('sessionId')) this.sessionId = data.sessionId;
    if( data.hasOwnProperty('requestId')) this.requestId = data.requestId;
    if( data.hasOwnProperty('requestTime')) this.requestTime = data.requestTime;
    if( data.hasOwnProperty('sql')) this.sql = data.sql;
  }

};

export class AgensResponseResultMeta {

  name: string;
  type: string;
  idx: number = -1;

  constructor( idx:number, data:any ){
    if( data.hasOwnProperty('label')) this.name = data.label;
    if( data.hasOwnProperty('type')) {
      if( ['int', 'float', 'number'].indexOf(data.type) >= 0 ) this.type = 'number';
      else if( ['graphid', 'text'].indexOf(data.type) >= 0 ) this.type = 'string';
      else this.type = data.type;
    }
    this.idx = idx;
  }

  public toTableColumn(){
    let isAgensType:boolean = ['graphpath','vertex','edge','jsonb'].indexOf(this.type) >= 0;
    let prop:string = this.name;
    //if( isAgensType ) prop += '.disp';
    return { name: this.name.toUpperCase(), prop: prop, type: this.type
      , isAgensType: isAgensType };
  }

};