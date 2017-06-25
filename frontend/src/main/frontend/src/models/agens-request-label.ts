export class AgensRequestLabel {
  graph: string;
  type: string;
  name: string;

  constructor(graph:string, type:string, name:string){
    this.graph = graph;
    this.type = type;
    this.name = name;
  }
}
