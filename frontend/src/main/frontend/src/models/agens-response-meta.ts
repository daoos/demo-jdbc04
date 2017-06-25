export class AgensResponseMetaDb {
  oid: number;
  name: string;
  owner: string;
  desc: string;
  graphs: AgensResponseMetaGraph[] = [];

  constructor( data:any ){
    if( data.hasOwnProperty('graphs')) {
      for( let item of data['graphs'] ){
        this.graphs.push( new AgensResponseMetaGraph(item) );
      }
    }
    if( data.hasOwnProperty('oid')) this.oid = data.oid;
    if( data.hasOwnProperty('name')) this.name = data.name;
    if( data.hasOwnProperty('owner')) this.owner = data.owner;
    if( data.hasOwnProperty('desc')) this.desc = data.desc;
  }

  toTreeData():any {
    let data = { id: this.oid, name: this.name, type: 'database', owner: this.owner, desc: this.desc, children: [] };
    for( let graph of this.graphs ){
      data.children.push( graph.toTreeData() );
    }
    return data;
  }

  findLabel(gName:string, lType:string, lName:string):AgensResponseMetaLabel {
    for( let graph of this.graphs ){
      if( graph.name == gName ){
        let labels = (lType == 'vertex') ? graph.vertexes : graph.edges;
        for( let label of labels ){
          if( label.name == lName ) return label;
        }
      }
    }
    return null;
  }

};

export class AgensResponseMetaGraph{
  oid: number;
  name: string;
  desc: string;
  vertexes: AgensResponseMetaLabel[] = [];
  edges: AgensResponseMetaLabel[] = [];

  constructor( data:any ){
    if( data.hasOwnProperty('vertexes')) {
      for( let item of data['vertexes'] ){
        this.vertexes.push( new AgensResponseMetaLabel(item) );
      }
    }    
    if( data.hasOwnProperty('edges')) {
      for( let item of data['edges'] ){
        this.edges.push( new AgensResponseMetaLabel(item) );
      }
    }    
    if( data.hasOwnProperty('oid')) this.oid = data.oid;
    if( data.hasOwnProperty('name')) this.name = data.name;
    if( data.hasOwnProperty('desc')) this.desc = data.desc;
  }

  toTreeData():any {
    let data = { id: this.oid, name: this.name, type: 'graph', desc: this.desc, children: [
      { id: this.oid+0.1, name: "vertexes", type: 'array', count: this.vertexes.length, children: []},
      { id: this.oid+0.2, name: "edges", type: 'array', count: this.edges.length, children: []},
    ]};
    for( let label of this.vertexes ){
      data.children[0].children.push( label.toTreeData() );
    }
    for( let label of this.edges ){
      data.children[1].children.push( label.toTreeData() );
    }
    return data;
  }
};

export class AgensResponseMetaLabel {
  g_oid: number;
  g_name: string;
  oid: number;
  type: string;
  name: string;
  owner: string;
  desc: string;
  count: number = 0;
  loaded_count: boolean = false;
  properties: AgensResponseMetaProperty[] = [];
  loaded_properties: boolean = false;

  constructor( data:any ){
    if( data.hasOwnProperty('g_oid')) this.g_oid = data.og_oidid;
    if( data.hasOwnProperty('g_name')) this.g_name = data.g_name;
    if( data.hasOwnProperty('oid')) this.oid = data.oid;
    if( data.hasOwnProperty('type')) this.type = data.type;
    if( data.hasOwnProperty('name')) this.name = data.name;
    if( data.hasOwnProperty('owner')) this.owner = data.owner;
    if( data.hasOwnProperty('desc')) this.desc = data.desc;
    if( data.hasOwnProperty('count')) this.count = data.count;
    if( data.hasOwnProperty('loaded_count')) this.loaded_count = data.loaded_count;
    if( data.hasOwnProperty('loaded_properties')) this.loaded_properties = data.loaded_properties;
    if( data.hasOwnProperty('properties')){
      for( let item of data.properties ){
        this.properties.push( new AgensResponseMetaProperty(item) );
      }
    }    
  }

  setCount( count:any ){
    this.count = Number(count);
    this.loaded_count = true;
  }
  setProperties( properties: any ){
    for( let item of properties ){
      this.properties.push( new AgensResponseMetaProperty(item) );
    }
    this.loaded_properties = true;
  }

  toTreeData():any {
    return { id: this.oid, name: this.name+` (${this.count})`, type: this.type, desc: this.desc
        , owner: this.owner, graph: this.g_name, label: this.name, loaded: this.loaded_properties };
  }

  toTreeDetails():any[] {
    let details = [];
    let index = 0;
    for( let property of this.properties ){
      let data = property.toTreeData();
      data.id = this.oid + ( (++index) * 0.1);
      details.push( data );
    }
    return details;
  }

};

export class AgensResponseMetaProperty {
  key: string;
  type: string;
  count: number = 0;

  constructor( data: any ){
    if( data.hasOwnProperty('key')) this.key = data.key;
    if( data.hasOwnProperty('type')) this.type = data.type;
    if( data.hasOwnProperty('count')) this.count = data.count;
  }

  toTreeData():any {
    return { name: this.key, type: this.type, desc: `It is used ${this.count} times` };
  }
  
}  
