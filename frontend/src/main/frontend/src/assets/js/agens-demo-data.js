(function( graph, $, undefined ) { 

  // Public Property : demoData
  graph.demoData = [
  // demoData[0]
  { nodes: [
      { data: { id: 'a', label: 'vertex-A', name: 'node A', props:{ href: 'http://js.cytoscape.org#a' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'b', label: 'vertex-A', name: 'node B', props:{ href: 'http://js.cytoscape.org#b' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'c', label: 'vertex-A', name: 'node C', props:{ href: 'http://js.cytoscape.org#c' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'd', label: 'vertex-B', name: 'node D', props:{ href: 'http://js.cytoscape.org#d' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'e', label: 'vertex-B', name: 'node E', props:{ href: 'http://js.cytoscape.org#e' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'f', label: 'vertex-A', name: 'node F', props:{ href: 'http://js.cytoscape.org#f' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'g', label: 'vertex-C', name: 'node G', props:{ href: 'http://js.cytoscape.org#g' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'h', label: 'vertex-C', name: 'node H', props:{ href: 'http://js.cytoscape.org#h' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'i', label: 'vertex-C', name: 'node I', props:{ href: 'http://js.cytoscape.org#i' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'j', label: 'vertex-A', name: 'node J', props:{ href: 'http://js.cytoscape.org#j' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'k', label: 'vertex-A', name: 'node K', props:{ href: 'http://js.cytoscape.org#k' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'l', label: 'vertex-D', name: 'node L', props:{ href: 'http://js.cytoscape.org#l' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'm', label: 'vertex-D', name: 'node M', props:{ href: 'http://js.cytoscape.org#m' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'n', label: 'vertex-D', name: 'node N', props:{ href: 'http://js.cytoscape.org#n' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'o', label: 'vertex-D', name: 'node O', props:{ href: 'http://js.cytoscape.org#o' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'p', label: 'vertex-A', name: 'node P', props:{ href: 'http://js.cytoscape.org#p' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'q', label: 'vertex-F', name: 'node Q', props:{ href: 'http://js.cytoscape.org#q' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'r', label: 'vertex-F', name: 'node R', props:{ href: 'http://js.cytoscape.org#r' }}, classes: 'demo-data', selectable: true, selected: false },
    ],           
    edges: [
      { data: { id: 'ae', label: 'edge-X', name: 'edge AE', weight: 1, source: 'a', target: 'e' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'ab', label: 'edge-X', name: 'edge AB', weight: 3, source: 'a', target: 'b' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'be', label: 'edge-X', name: 'edge BE', weight: 4, source: 'b', target: 'e' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'bc', label: 'edge-X', name: 'edge BC', weight: 5, source: 'b', target: 'c' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'ce', label: 'edge-X', name: 'edge CE', weight: 6, source: 'c', target: 'e' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'cd', label: 'edge-X', name: 'edge CD', weight: 2, source: 'c', target: 'd' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'de', label: 'edge-X', name: 'edge DE', weight: 7, source: 'd', target: 'e' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'af', label: 'edge-Y', name: 'edge AF', weight: 8, source: 'a', target: 'f' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'bh', label: 'edge-Y', name: 'edge BH', weight: 7, source: 'b', target: 'h' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'bo', label: 'edge-Y', name: 'edge BO', weight: 2, source: 'b', target: 'o' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'bp', label: 'edge-Y', name: 'edge BP', weight: 3, source: 'b', target: 'p' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'br', label: 'edge-Y', name: 'edge BR', weight: 4, source: 'b', target: 'r' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'cg', label: 'edge-Y', name: 'edge CG', weight: 5, source: 'c', target: 'g' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'cj', label: 'edge-Y', name: 'edge CJ', weight: 6, source: 'c', target: 'j' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'co', label: 'edge-Y', name: 'edge CO', weight: 2, source: 'c', target: 'o' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'di', label: 'edge-Y', name: 'edge DI', weight: 7, source: 'd', target: 'i' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'dq', label: 'edge-Y', name: 'edge DQ', weight: 6, source: 'd', target: 'q' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'eh', label: 'edge-Z', name: 'edge EH', weight: 2, source: 'e', target: 'h' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'fk', label: 'edge-Z', name: 'edge FK', weight: 9, source: 'f', target: 'k' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'kl', label: 'edge-Z', name: 'edge kl', weight: 5, source: 'k', target: 'l' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'ke', label: 'edge-Z', name: 'edge KE', weight: 5, source: 'k', target: 'e' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'kn', label: 'edge-Z', name: 'edge KN', weight: 7, source: 'k', target: 'n' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'mj', label: 'edge-Z', name: 'edge MJ', weight: 1, source: 'm', target: 'j' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'na', label: 'edge-Z', name: 'edge NA', weight: 1, source: 'n', target: 'a' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'np', label: 'edge-Z', name: 'edge np', weight: 2, source: 'n', target: 'p' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'pe', label: 'edge-Z', name: 'edge PE', weight: 3, source: 'p', target: 'e' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'pf', label: 'edge-Z', name: 'edge PF', weight: 8, source: 'p', target: 'f' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'pg', label: 'edge-Z', name: 'edge PG', weight: 4, source: 'p', target: 'g' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'rk', label: 'edge-Z', name: 'edge RK', weight: 8, source: 'r', target: 'k' }, classes: 'demo-data', selectable: true, selected: false },
    ]},
    // demoData[1]
    { 
      nodes: [
      { data: { id: 'a', label: 'vertex-A', name: 'node A', props:{ href: 'http://js.cytoscape.org#a' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'a', label: 'vertex-A', name: 'node A', props:{ href: 'http://js.cytoscape.org#a' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'a', label: 'vertex-A', name: 'node A', props:{ href: 'http://js.cytoscape.org#a' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'a', label: 'vertex-A', name: 'node A', props:{ href: 'http://js.cytoscape.org#a' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'a', label: 'vertex-A', name: 'node A', props:{ href: 'http://js.cytoscape.org#a' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'a', label: 'vertex-A', name: 'node A', props:{ href: 'http://js.cytoscape.org#a' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: 'b', label: 'vertex-A', name: 'node B', props:{ href: 'http://js.cytoscape.org#b' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: '11', label: 'vertex-A', name: 'node 11', props:{ href: 'http://js.cytoscape.org#a' }}, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: '12', label: 'vertex-A', name: 'node 12', props:{ href: 'http://js.cytoscape.org#b' }}, classes: 'demo-data', selectable: true, selected: false },
      ],
      edges: [
      { data: { id: 'ab', label: 'edge-X', name: 'edge AB', weight: 1, source: 'a', target: 'b' }, classes: 'demo-data', selectable: true, selected: false },
      { data: { id: '1112', label: 'edge-X', name: 'edge 1112', weight: 1, source: '11', target: '12' }, classes: 'demo-data', selectable: true, selected: false },
      ]
    },
    // demoData[2]
    { 
      nodes: [],
      edges: []
    },
  ];
  /////////////////////////////////////////////////////////

  console.log("agens-demo-data.js is loaded!");
 
}( window.agens.graph = window.agens.graph || {}, jQuery ));
