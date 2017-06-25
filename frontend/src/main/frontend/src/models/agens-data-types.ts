export class AgensTypePath {

  vertexes: AgensTypeVertex[] = [];
  edges: AgensTypeEdge[] = [];
  svertex: AgensTypeVertex = null;
  evertex: AgensTypeVertex = null;

  constructor( data:any ){
    if( typeof data !== 'object' ){
      console.warn("WARNING: may be not AgensTypePath!");
      return;
    }
    if( data.hasOwnProperty('vertexes')) {
      for( let item of data['vertexes'] ){
        this.vertexes.push( new AgensTypeVertex(item) );
      }
    }
    if( data.hasOwnProperty('edges')) {
      for( let item of data['edges'] ){
        this.edges.push( new AgensTypeEdge(item) );
      }
    }      
    if( data.hasOwnProperty('svertex')) this.svertex = new AgensTypeVertex(data['svertex']);
    if( data.hasOwnProperty('evertex')) this.evertex = new AgensTypeVertex(data['evertex']);
  }

  public static getType(){
    return "graphpath";
  }

  public toNodes():any[] {
    let eles:any[] = [];
    for( let vertex of this.vertexes ){
      let ele = vertex.toNode();
      if( vertex.vid === this.svertex.vid ) ele['data']['_order']='start';
      else if( vertex.vid === this.evertex.vid ) ele['data']['_order']='end';
      eles.push( ele );
    }
    return eles;
  }
  public toEdges():any[] {
    let eles:any[] = [];
    for( let edge of this.edges ){
      let ele = edge.toEdge();
      if( edge.svid === this.svertex.vid ) ele['data']['_order']='start';
      else if( edge.evid === this.evertex.vid ) ele['data']['_order']='end';
      eles.push( ele );
    }
    return eles;
  }

  public toTableData():any {
    let edge:AgensTypeEdge = this.edges[0];
    let disp:string = `(:${this.svertex.label}<${this.svertex.vid}>)->[:${edge.label}<${edge.eid}>]->(:${this.evertex.label}<${this.evertex.vid}>)`;
    let value:any = {
      vertexes: this.vertexes,
      edges: this.edges
    };
    return { disp: disp, value: value };
  }

};

export class AgensTypeVertex {

  vid: string;
  label: string;
  props: any;

  constructor( data: any ){
    if( typeof data !== 'object' ){
      console.warn("WARNING: may be not AgensTypeVertex!");
      return;
    }
    if( data.hasOwnProperty('vid')) this.vid = data['vid'];
    if( data.hasOwnProperty('label')) this.label = data['label'];
    if( data.hasOwnProperty('props')) this.props = data['props'];
  }

  public static getType(){
    return "vertex";
  }

  public toNode():any {
    let name = this.props.hasOwnProperty('name') ? this.props['name']
        : (this.props.hasOwnProperty('title') ? this.props['title'] : this.vid);
    // name = '<b>111&nbsp; '+name+'</b>';    // 모두 텍스트로만 출력됨
    let ele = {'data': { 
        'id': ''+this.vid, 'label': this.label, 'name': name, 'props': this.props 
        }, selectable: true, selected: false};
    return ele;
  }

  public toTableData():any {
    let disp:string = `(:${this.label}<${this.vid}>)`;
    let value:any = {
      id: this.vid,
      label: this.label,
      props: this.props
    };
    return { disp: disp, value: value };
  }

};

export class AgensTypeEdge {

  eid: string;
  svid: string;
  evid: string;
  label: string;
  props: any;

  constructor( data: any ){
    if( typeof data !== 'object' ){
      console.warn("WARNING: may be not AgensTypeEdge!");
      return;
    }
    if( data.hasOwnProperty('eid')) this.eid = data['eid'];
    if( data.hasOwnProperty('svid')) this.svid = data['svid'];
    if( data.hasOwnProperty('evid')) this.evid = data['evid'];
    if( data.hasOwnProperty('label')) this.label = data['label'];
    if( data.hasOwnProperty('props')) this.props = data['props'];
  }

  public static getType(){
    return "edge";
  }

  public toEdge():any {
    let name = this.props.hasOwnProperty('name') ? this.props['name']
        : (this.props.hasOwnProperty('title') ? this.props['title'] : this.eid);
    let ele = {'data': { 
        'id': ''+this.eid, 'label': this.label, 'name': name, 'props': this.props,
        'source': ''+this.svid, 'target': ''+this.evid
        }, selectable: true, selected: false};
    return ele;
  }

  public toTableData():any {
    let disp:string = `(:${this.label}<${this.eid}>)`;
    let value:any = {
      id: this.eid,
      label: this.label,
      props: this.props
    };
    return { disp: disp, value: value };
  }

};

export class AgensTypeJsonb {
  
  id:string = "";
  name:string = "";
  value:any = null;

  constructor( data:any ){
    if( typeof data !== 'object' ){
      console.warn("WARNING: may be not AgensTypeJsonb!");
      return;
    }
    if( data.hasOwnProperty('id')) this.id = String(data['id']);
    if( data.hasOwnProperty('name')) this.name = String(data['name']);
    else if( data.hasOwnProperty('title')) this.name = String(data['title']);
    else if( data.hasOwnProperty('id')) this.name = String(data['id']);
    this.value = data;
  }

  public static getType(){
    return "jsonb";
  }

  public toTableData():any {
    let disp:string = `{id:${this.id}, name:${this.name}, ..}`;
    return { disp: disp, value: this.value };
  }
  
}
