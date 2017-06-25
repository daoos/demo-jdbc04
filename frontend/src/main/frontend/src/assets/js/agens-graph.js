// Title: Agens Graph Utilities using Cytoscape
// Right: Bitnine.net
// Author: Byeong-Guk Min <maxmin93@gmail.com>

// Self-Executing Anonymous Func: Part 2 (Public &amp; Private)
// ** 참고
// https://stackoverflow.com/a/5947280/6811653

// Structure
// ----------------------
//  agens
//    .cy
//    .graph
//      .defaultSetting, .defaultStyle, .demoData[], .layoutTypes[]
//      .ready(), .loadData(), saveFile(), saveImage()
//    .api
//      .view
//      .unre
//    .dialog
//      .propertyBox
//      .styleBox
//      .nodeBox
//

(function( agens, $, undefined ) { 

  // sub namespaces : graph, api, dialog
  agens.cy = null;
  agens.graph = agens.graph || {};
  agens.api = agens.api || {};
  agens.dialog = agens.dialog || {};

  /////////////////////////////////////////////////////////
  //  NAMESPACE: agens.graph
  /////////////////////////////////////////////////////////

  // Public Property : defaultStyle
  agens.graph.defaultStyle = [{
      selector: 'core',
			css: {
					"selection-box-color": "#11bf1c",
					"selection-box-opacity": 0.25,
					"selection-box-border-color": "#aaa",
					"selection-box-border-width": 1,
					"panning-cursor": "grabbing",
			}}, {
      selector: 'node',
      css: {
          'content': 'data(name)',
          // 'text-opacity': 0.7, 'text-halign': 'right', 'width': 8,
          'text-valign': 'center',
          'color': 'white',
          'text-outline-width': 2,
          'text-outline-color': '#888',
          'border-width': 1
      }}, {
      selector: 'node:parent',
      css: {
          'content': 'data(name)',
          'text-valign': 'bottom',
          'color': 'white',
          'text-outline-width': 1,
          'text-outline-color': '#888',
          'border-width': 0,
          'border-color': 'white'
      }}, {
      selector: 'node:selected',
      css: {
          'background-color': 'back',
          'text-outline-color': 'black',
          'border-color': 'black',
          'border-width': 3,
          'opacity': 1
      }},{
      selector: 'node:locked',
      css: {
          'background-color': 'red',
          'text-outline-color': 'black',
          'border-color': 'white',
          'border-width': 3,
          'opacity': 1
      }},{
      selector: 'edge',
      css: {
          'target-arrow-shape': 'triangle',
          'width': 2,
          'curve-style': 'bezier',
          'background-color': 'black',
          'line-color': '#B788BF',
          'color': 'black',
          'target-arrow-color': '#B788BF',
          'source-arrow-color': 'black',
          'text-outline-color': 'black'
      }}, {
      selector: 'edge:selected',
      css: {
          'line-color': 'black',
          'width': 4,
          'opacity':1,
          'target-arrow-color': 'black',
      }},{
      selector: 'edge:locked',
      css: {
          'line-color': 'red',
          'width': 4,
          'opacity':1,
          'target-arrow-color': 'red',
      }},{
      selector: '.highlighted',
      css: {
          'background-color': '#61bffc',
          'line-color': '#61bffc',
          'target-arrow-color': '#61bffc',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.2s'
      }},{
      selector: '.traveled',
      css: {
          'background-color': '#11bf1c',
          'line-color': '#11bf1c',
          'target-arrow-color': '#11bf1c',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.2s'
      }},{
      selector: '.edgehandles-hover',
      css: {
          'background-color': 'red'
      }},{
      selector: '.edgehandles-source',
      css: {
          'border-width': 2,
          'border-color': 'red'
      }},{
      selector: '.edgehandles-target',
      css: {
          'border-width': 2,
          'border-color': 'red'
      }},{
      selector: '.edgehandles-preview, .edgehandles-ghost-edge',
      css: {
          'line-color': 'red',
          'target-arrow-color': 'red',
          'source-arrow-color': 'red'
      }
  }];

  // Public Property : Layout Options
  agens.graph.layoutTypes = [
    {
      name: 'grid',
      fit: true, // whether to fit the viewport to the graph
      padding: 30, // padding used on fit
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
      nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
      spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
      condense: false, // uses all available space on false, uses minimal space on true
      rows: undefined, // force num of rows in the grid
      cols: undefined, // force num of columns in the grid
      position: function( node ){}, // returns { row, col } for element
      sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
    },{
      name: 'random',
      fit: true, // whether to fit to viewport
      padding: 30, // fit padding
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
    },{
      name: 'breadthfirst',      
      fit: true, // whether to fit the viewport to the graph
      directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
      padding: 30, // padding on fit
      circle: false, // put depths in concentric circles if true, put depths top down if false
      spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
      roots: undefined, // the roots of the trees
      maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
    },{
      name: 'circle',
      fit: true, // whether to fit the viewport to the graph
      padding: 30, // the padding on fit
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
      nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
      spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
      radius: undefined, // the radius of the circle
      startAngle: 3 / 2 * Math.PI, // where nodes start in radians
      sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
      clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
      sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
    },{
      name: 'concentric',      
      fit: true, // whether to fit the viewport to the graph
      padding: 30, // the padding on fit
      startAngle: 3 / 2 * Math.PI, // where nodes start in radians
      sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
      clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
      equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
      minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
      height: undefined, // height of layout area (overrides container height)
      width: undefined, // width of layout area (overrides container width)
      spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
      concentric: function( node ){ // returns numeric value for each node, placing higher nodes in levels towards the centre
        return node.degree();
      },
      levelWidth: function( nodes ){ // the variation of concentric values in each level
        return nodes.maxDegree() / 4;
      },
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
    },{
      name: 'cola',  
      animate: true, // whether to show the layout as it's running
      refresh: 1, // number of ticks per frame; higher is faster but more jerky
      maxSimulationTime: 4000, // max length in ms to run the layout
      ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
      fit: true, // on every layout reposition of nodes, fit the viewport
      padding: 30, // padding around the simulation
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      // positioning options
      randomize: true, // use random node positions at beginning of layout
      avoidOverlap: true, // if true, prevents overlap of node bounding boxes
      handleDisconnected: true, // if true, avoids disconnected components from overlapping
      nodeSpacing: function (node) {
        return 10;
      }, // extra spacing around nodes
      flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
      alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }
      // different methods of specifying edge length
      // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
      edgeLength: undefined, // sets edge length directly in simulation
      edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
      edgeJaccardLength: undefined, // jaccard edge length in simulation
      // iterations of cola algorithm; uses default values on undefined
      unconstrIter: undefined, // unconstrained initial layout iterations
      userConstIter: undefined, // initial layout iterations with user-specified constraints
      allConstIter: undefined, // initial layout iterations with all constraints including non-overlap
      // infinite layout options
      infinite: false // overrides all other options for a forces-all-the-time mode      
    },{
      name: 'cose',
      animate: true,    // Whether to animate while running the layout
      // The layout animates only after this many milliseconds  
      animationThreshold: 250,    // (prevents flashing on fast runs)
      // Number of iterations between consecutive screen positions update  
      refresh: 20,    // (0 -> only updated on the end)
      fit: true,    // Whether to fit the network view after when done
      padding: 30,    // Padding on fit
      boundingBox: undefined,   // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      nodeDimensionsIncludeLabels: false,   // Excludes the label when calculating node bounding boxes for the layout algorithm
      randomize: true,   // Randomize the initial positions of the nodes (true) or use existing positions (false)
      componentSpacing: 100,    // Extra spacing between components in non-compound graphs
      nodeRepulsion: function( node ){ return 400000; },    // Node repulsion (non overlapping) multiplier
      nodeOverlap: 10,    // Node repulsion (overlapping) multiplier
      idealEdgeLength: function( edge ){ return 10; },    // Ideal edge (non nested) length
      edgeElasticity: function( edge ){ return 100; },    // Divisor to compute edge forces
      nestingFactor: 5,   // Nesting factor (multiplier) to compute ideal edge length for nested edges
      gravity: 80,    // Gravity force (constant)
      numIter: 1000,    // Maximum number of iterations to perform
      initialTemp: 200,   // Initial temperature (maximum node displacement)
      coolingFactor: 0.95,    // Cooling factor (how the temperature is reduced between consecutive iterations
      minTemp: 1.0,   // Lower temperature threshold (below this point the layout will end)
      weaver: false   // Pass a reference to weaver to use threads for calculations
    },{
      name: 'cose-bilkent',
      refresh: 0,   // Number of iterations between consecutive screen positions update (0 -> only updated on the end)
      fit: true,    // Whether to fit the network view after when done
      padding: 10,    // Padding on fit
      incremental: true,    // Whether to enable incremental mode
      debug: false,   // Whether to use the JS console to print debug messages
      nodeRepulsion: 4500,    // Node repulsion (non overlapping) multiplier
      nodeOverlap: 10,    // Node repulsion (overlapping) multiplier
      idealEdgeLength: 50,    // Ideal edge (non nested) length
      edgeElasticity: 0.45,   // Divisor to compute edge forces
      nestingFactor: 0.1,   // Nesting factor (multiplier) to compute ideal edge length for nested edges
      gravity: 0.4,   // Gravity force (constant)
      numIter: 2500,    // Maximum number of iterations to perform
      initialTemp: 200,   // Initial temperature (maximum node displacement)
      coolingFactor: 0.95,    // Cooling factor (how the temperature is reduced between consecutive iterations
      minTemp: 1,   // Lower temperature threshold (below this point the layout will end)
      tile: true,   // For enabling tiling
      animate: true   //whether to make animation while performing the layout
    },{
      name: 'dagre',
      fit: true, // whether to fit to viewport
      padding: 30, // fit padding
      spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
      animate: true, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      // dagre algo options, uses default value on undefined
      nodeSep: undefined, // the separation between adjacent nodes in the same rank
      edgeSep: undefined, // the separation between adjacent edges in the same rank
      rankSep: undefined, // the separation between adjacent nodes in the same rank
      rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right
      minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
      edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges      
    }
/*    
    ,{
      name: 'arbor',
      animate: true, // whether to show the layout as it's running
      maxSimulationTime: 4000, // max length in ms to run the layout
      fit: true, // on every layout reposition of nodes, fit the viewport
      padding: 30, // padding around the simulation
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
      // forces used by arbor (use arbor default on undefined)
      repulsion: undefined,
      stiffness: undefined,
      friction: undefined,
      gravity: true,
      fps: undefined,
      precision: undefined,
      // static numbers or functions that dynamically return what these
      // values should be for each element
      // e.g. nodeMass: function(n){ return n.data('weight') }
      nodeMass: undefined,
      edgeLength: undefined,
      stepSize: 0.1, // smoothing of arbor bounding box
      // function that returns true if the system is stable to indicate
      // that the layout can be stopped
      stableEnergy: function (energy) {
          var e = energy;
          return (e.max <= 0.5) || (e.mean <= 0.3);
      },
      // infinite layout options
      infinite: false // overrides all other options for a forces-all-the-time mode
    }
*/    
  ];

  // Public Property : defaultSetting
  agens.graph.defaultSetting = {
    container: document.getElementById('agens-graph'),
    style: agens.graph.defaultStyle,
    elements: { nodes: [], edges: [] },   // agens.graph.demoData[0],
    layout: agens.graph.layoutTypes[0],
    // initial viewport state:
    zoom: 1,
    pan: { x: 0, y: 0 },
    // interaction options:
    minZoom: 1e-25,
    maxZoom: 1e1,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    panningEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: true,
    selectionType: 'single',
    touchTapThreshold: 8,
    desktopTapThreshold: 4,
    autolock: false,
    autoungrabify: false,
    autounselectify: false,
    // rendering options:
    headless: false,
    styleEnabled: true,
    hideEdgesOnViewport: false,
    hideLabelsOnViewport: false,
    textureOnViewport: false,
    motionBlur: false,
    motionBlurOpacity: 0.2,
    wheelSensitivity: 0.7,
    pixelRatio: 'auto',

    /////////////////////////////////////////////////////////
    // NAMESPACE: agens.cy
    /////////////////////////////////////////////////////////
      
    // ready function
    ready: function(e){
      agens.cy = e.cy;
      agens.graph.ready();
    },
  };

  // Public Function : graphFactory()
  agens.graph.loadData = function(data){
    if( agens.cy === undefined ) return;
    // initialize
    agens.cy.elements().remove();
    agens.cy.style( agens.defaultStyle );

    // load data
    agens.cy.add( data );

    // just use the regular qtip api but on cy elements
    agens.cy.elements().qtip({
      content: function(){ 
        var name = this.data('name');
        var label = this.data('label');
        var id = this.id();
        return `id: ${id}<br>\nlabel: ${label}<br>\nname: ${name}`; 
      },
      position: {
        my: 'bottom left',  // Position my top left...
        at: 'top right', // at the bottom right of...
      },
      style: {
        classes: 'qtip-tipsy qtip-shadow qtip-rounded',
        tip: {
          width: 16,
          height: 8
        }
      }
    });

    var panProps = ({
        zoomFactor: 0.05, // zoom factor per zoom tick
        zoomDelay: 45, // how many ms between zoom ticks
        minZoom: 0.1, // min zoom level
        maxZoom: 10, // max zoom level
        fitPadding: 50, // padding when fitting
        panSpeed: 10, // how many ms in between pan ticks
        panDistance: 10, // max pan distance per tick
        panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
        panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
        panInactiveArea: 8, // radius of inactive area in pan drag box
        panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
        autodisableForMobile: true, // disable the panzoom completely for mobile (since we don't really need it with gestures like pinch to zoom)
        // icon class names
        sliderHandleIcon: 'fa fa-minus',
        zoomInIcon: 'fa fa-plus',
        zoomOutIcon: 'fa fa-minus',
        resetIcon: 'fa fa-expand'    });
    agens.cy.panzoom(panProps);

    // adjust layout
    agens.cy.makeLayout(agens.graph.layoutTypes[0]).run();
    agens.cy.fit( agens.cy.elements(), 50 ); // fit to all the layouts
    agens.cy.resize();    
  };

  // private Function 
  var makeid = function(){
    var text = "_id_";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  // public Function : addNode
  agens.graph.addNode = function( name, w, h, color, shape, borderColor, property ) {
    var props = {};
    try {
      props = JSON.parse( property );
    }catch(e){
      console.error("addNode(): json.parse error on property!\n"+property);
    }

    props.name = name;
    props.vid = makeid();
    if( !props.hasOwnProperty('label') || props.label == "" ) props.label = "none";

    var newNode = {
        group: "nodes",
        data: { 'id': props.id, 'name': props.name, 'label': props.label, 'props': props },
        position: { x: agens.graph.cyPosition.x, y: agens.graph.cyPosition.y },
        selectable: true, selected: false, classes: 'user-add',
        css: {
          'content': 'data(name)',
          'shape': shape, 'width': w, 'height': h, 'background-color': '#'+color,
          'text-valign': 'center', 'text-outline-width': 2, 'text-outline-color': '#888',
          'border-width': 1, 'border-color': '#'+borderColor
    }};
    agens.cy.add(newNode);
  };

  // public Function: updateNode
  agens.graph.updateNode = function( id, name, w, h, color, shape, borderColor, property ) {
    var props = {};
    try {
      props = JSON.parse( property );
    }catch(e){
      console.error("addNode(): json.parse error on property!\n"+property);
    }

    props.name = name;
    if( !props.hasOwnProperty('vid') || props.vid == "" ) props.vid = makeid();
    if( !props.hasOwnProperty('label') || props.label == "" ) props.label = "none";

    agens.cy.$(`[id='${id}']`)
      .data('name', name)
      .data('label', props.label)
      .data('props', props)
      .addClass('user-update')
      .style({
          'content': 'data(name)',
          'shape': shape, 'width': w, 'height': h, 'background-color': '#'+color,
          'text-valign': 'center', 'text-outline-width': 2, 'text-outline-color': '#888',
          'border-width': 1, 'border-color': '#'+borderColor
      });
  };

  // public Function: updateEdge
  agens.graph.updateEdge = function( id, name, w, color, /*borderColor,*/ property ) {
    var props = {};
    try {
      props = JSON.parse( property );
    }catch(e){
      console.error("addEdge(): json.parse error on property!\n"+property);
    }

    props.name = name;
    if( !props.hasOwnProperty('eid') || props.eid == "" ) props.eid = makeid();
    if( !props.hasOwnProperty('label') || props.label == "" ) props.label = "none";

    agens.cy.$(`[id='${id}']`)
      .data('name', name)
      .data('label', props.label)
      .data('props', props)
      .addClass('user-update')
      .style({
          'content': 'data(name)',
          'width': w,'line-color': '#'+color, 'target-arrow-color': '#'+color,
          'text-valign': 'center', 'text-outline-width': 2, 'text-outline-color': '#888',
          //'border-width': 1, 'border-color': '#'+borderColor
      });
  };

  // Public Function : graphFactory()
  agens.graph.graphFactory = function(target){
    agens.graph.defaultSetting.container = target;
    return cytoscape(agens.graph.defaultSetting);
  };

  // Public Function : ready()
  agens.graph.ready = function(){

    // just use the regular qtip api but on cy elements
    agens.cy.elements().qtip({
      content: function(){ 
        var name = this.data('name');
        var label = this.data('label');
        var id = this.id();
        return `id: ${id}<br>\nlabel: ${label}<br>\nname: ${name}`; 
      },
      position: {
        my: 'bottom left',  // Position my top left...
        at: 'top right', // at the bottom right of...
      },
      style: {
        classes: 'qtip-tipsy qtip-shadow qtip-rounded',
        tip: {
          width: 16,
          height: 8
        }
      }
    });

    // cxt menu for node, edge
    agens.cy.cxtmenu({
      selector: 'node, edge',
      menuRadius: 80,
      fillColor: 'rgba(50, 0, 0, 0.65)',
      commands: [{
          content: '<span style="display:inline-block; width:20px; font-size:10pt">Lock</span>',
          select: function(ele){
            agens.cy.$(`[id='${ele.id()}']`).select();
            if( agens.cy.$(`[id='${ele.id()}']`).locked() ) agens.cy.$(":selected").unlock();
            else agens.cy.$(":selected").lock();
          }
        },{
          content: '<span style="display:inline-block; width:20px; font-size:10pt">Property</span>',
          select: function(ele){
            agens.dialog.openPropertyBox( ele );
          }
        },{
          content: '<span style="display:inline-block; width:20px; font-size:10pt">remove</span>',
          select: function(ele){
            agens.cy.$(`[id='${ele.id()}']`).select();
            agens.cy.$(":selected").remove();
          }
        },{
          content: '<span style="display:inline-block; width:20px; font-size:10pt">hide</span>',
          select: function(ele){
            agens.cy.$(`[id='${ele.id()}']`).select();
            agens.api.view.hide(agens.cy.$(":selected"));
          }
        }
      ]
    });

    // cxt menu for core
    agens.cy.cxtmenu({
      menuRadius: 80,
      selector: 'core',
      fillColor: 'rgba(0, 60, 0, 0.65)',
      commands: [{
          content: '<span style="display:inline-block; width:20px; font-size:10pt">add Node</span>',
          select: function(){
            event.preventDefault();
            agens.dialog.openAddNodeBox("open");
          }
        },{
          content: '<span style="display:inline-block; width:20px; font-size:10pt">show All</span>',
          select: function(){
            agens.api.view.show(agens.cy.$(":hidden"));
          },
        },{
          content: '<span style="display:inline-block; width:20px; font-size:10pt">unlock All</span>',
          select: function(){
            agens.cy.$(":locked").unlock();
          }
        }
      ]
    });

    // on&off control: cy.edgehandles('enable') or cy.edgehandles('disable')
    agens.cy.edgehandles({
      toggleOffOnLeave: true,
      handleNodes: "node",
      handleSize: 10,
      edgeType: function(){ return 'flat'; }
    });

    agens.cy.panzoom({
			zoomFactor: 0.05, // zoom factor per zoom tick
      zoomDelay: 45, // how many ms between zoom ticks
      minZoom: 0.1, // min zoom level
      maxZoom: 10, // max zoom level
      fitPadding: 50, // padding when fitting
      panSpeed: 10, // how many ms in between pan ticks
      panDistance: 10, // max pan distance per tick
      panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
      panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
      panInactiveArea: 3, // radius of inactive area in pan drag box
      panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
      autodisableForMobile: true, // disable the panzoom completely for mobile (since we don't really need it with gestures like pinch to zoom)
      // additional
      zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
      fitSelector: undefined, // selector of elements to fit
      animateOnFit: function(){ // whether to animate on fit
        return false;
      },
      // icon class names
      sliderHandleIcon: 'fa fa-minus',
      zoomInIcon: 'fa fa-plus',
      zoomOutIcon: 'fa fa-minus',
      resetIcon: 'fa fa-expand'      
		});

    // ==========================================
    // ==  cy events 등록
    // ==========================================

    agens.cy.on('tap', function(e){
      // console.log( cyPosition );
      if( e.cyTarget === agens.cy ){
        agens.api.view.removeHighlights();
        agens.cy.$(':selected').unselect();
        agens.graph.pivotNode = null;
      }
    });
    agens.cy.on('tap', 'node', function(e){
      agens.graph.pivotNode = e.cyTarget;
      agens.api.view.removeHighlights();
      agens.api.view.highlightNeighbors( e.cyTarget );
    });
    // agens.cy.on('mouseover', 'node', function(e){
    //   this.addClass('highlighted');
    // });
    // agens.cy.on('mouseout', 'node', function(e){
    //   this.removeClass('highlighted');
    // });
    agens.cy.on('cxttapstart', function(e){
      agens.graph.cyPosition = e.cyPosition;
    });

    // 화면에 맞게 elements 정렬
    agens.cy.fit( agens.cy.elements(), 50 ); // fit to all the layouts

    /////////////////////////////////////////////////////////
    //  NAMESPACE: agens.api
    /////////////////////////////////////////////////////////

    // Public Property : APIs about view and undoredo
    agens.api.view = agens.cy.viewUtilities({
        neighbor: function(node){
            return node.closedNeighborhood();
        },
        neighborSelectTime: 1000
    });

    // Public Property : UndoRedo for cy
    agens.api.unre = agens.cy.undoRedo();
    
  };

  /////////////////////////////////////////////////////////
  //  NAMESPACE: agens.dialog
  /////////////////////////////////////////////////////////

  agens.dialog.ready = function(){
    $("#agens-node-box").hide();
    $("#agens-edge-box").hide();
    $("#agens-image-export").hide();
  }
  agens.dialog.ready();

  agens.dialog.setting = {
    'addNode': {
        autoOpen: false,
        title: 'New Node Box',
        modal: true,
        maxWidth: 400,
        maxHeight: 600,
        draggable: true,
        resizable: false,
        position: { my: "center", at: "center", of: window },
        show: 'fade',      // 'blind'
        hide: 'fade',      // 'fade'
        closeText: 'close',
        buttons: [{
          text: "Done",
          icons: {
            primary: "ui-icon-heart"
          },
          click: function() {
              var name = $("#property-node-name").val().trim();
              var property = $("#property-node-props").val().trim();
              var w = $("#property-node-width").val().replace(' ','');
              var h = $("#property-node-height").val().replace(' ','');
              var color = $("#property-node-color").val();
              var shape = $("#property-node-shape").val();
              var borderColor = $("#property-node-border-color").val();

              agens.graph.addNode(name, w, h, color, shape, borderColor, property);
              $(this).dialog("close");
          }
      }]      
    },
    'nodeProperty': {
        autoOpen: false,
        title: 'Node Property Box',
        modal: true,
        maxWidth: 400,
        maxHeight: 600,
        draggable: true,
        resizable: false,
        position: { my: "center", at: "center", of: window },
        show: 'fade',      // 'blind'
        hide: 'fade',      // 'fade'
        closeText: 'close',
        buttons: [{
          text: "Update",
          icons: {
            primary: "ui-icon-heart"
          },
          click: function() {
              var id = $("#property-node-id").val().trim();
              var name = $("#property-node-name").val().trim();
              var property = $("#property-node-props").val().trim();
              var w = $("#property-node-width").val().replace(' ','');
              var h = $("#property-node-height").val().replace(' ','');
              var color = $("#property-node-color").val();
              var shape = $("#property-node-shape").val();
              var borderColor = $("#property-node-border-color").val();

              agens.graph.updateNode(id, name, w, h, color, shape, borderColor, property);
              $(this).dialog("close");
          }
      }]      
    },
    'edgeProperty': {
        autoOpen: false,
        title: 'Edge Property Box',
        modal: true,
        maxWidth: 400,
        maxHeight: 600,
        draggable: true,
        resizable: false,
        position: { my: "center", at: "center", of: window },
        show: 'fade',      // 'blind'
        hide: 'fade',      // 'fade'
        closeText: 'close',
        buttons: [{
          text: "Update",
          icons: {
            primary: "ui-icon-heart"
          },
          click: function() {
              var id = $("#property-edge-id").val().trim();
              var name = $("#property-edge-name").val().trim();
              var property = $("#property-edge-props").val().trim();
              var w = $("#property-edge-width").val().replace(' ','');
              var color = $("#property-edge-color").val();

              agens.graph.updateEdge(id, name, w, color, property);
              $(this).dialog("close");
          }
      }]
    },
    'imageExport': {
        autoOpen: false,
        title: 'Image Export Box',
        modal: true,
        minWidth: 800,
        minHeight: 400,
        draggable: true,
        resizable: true,
        position: { my: "center", at: "center", of: window },
        show: 'fade',      // 'blind'
        hide: 'fade',      // 'fade'
        closeText: 'close',
        buttons: [{
          text: "Export",
          icons: {
            primary: "ui-icon-heart"
          },
          click: function() {
            // var pngContent = $("#agens-image-export").find("img").attr("src");
            var bgcolor = $("#image-export-bgcolor").val();
            var filename = $("#image-export-filename").val().replace(' ','');
            var watermark = $("#image-export-watermark").val();

            var pngContent = agens.cy.png({scale : 3, full : true, bg: '#'+bgcolor});
            // this is to remove the beginning of the pngContent: data:img/png;base64,
            var b64data = pngContent.substr(pngContent.indexOf(",") + 1);
            // saveAs(b64toBlob(b64data, "image/png"), filename+".png");

            var blob = b64toBlob(b64data, "image/png");
            var blobUrl = URL.createObjectURL(blob);
              $('<img>', {
                src: blobUrl
              }).watermark({
                text: watermark,
                textSize: 60, textWidth: 320,
                textColor: 'white', textBg: 'rgba(0, 0, 0, 0.4)', opacity: 0.7,
                margin: 15, outputType: "png", outputWidth: 'auto', outputHeight: 'auto',
                done: function(imgURL){
                  var b64data2 = imgURL.substr(imgURL.indexOf(",") + 1);
                  var blob2 = b64toBlob(b64data2, "image/png")
                  saveAs(blob2, filename+".png");
                }
              });
          }
      },{
          text: "Cancel",
          click: function() { $(this).dialog("close"); }        
      }]
    },
    'JsonExport': {
        autoOpen: false,
        title: 'JSON Export',
        modal: true,
        minWidth: 400,
        minHeight: 100,
        draggable: true,
        resizable: true,
        position: { my: "center", at: "center", of: window },
        show: 'fade',      // 'blind'
        hide: 'fade',      // 'fade'
        closeText: 'close',
        buttons: [{
          text: "Export",
          icons: {
            primary: "ui-icon-heart"
          },
          click: function() {
            var element = $("#json-export-file-name");
            blob = new Blob([JSON.stringify(agens.cy.json())], {type: "application/json;charset=utf-8"});
            saveAs( blob, element.val());
          }
      },{
          text: "Cancel",
          click: function() { $(this).dialog("close"); }        
      }]
    }
  };

  agens.dialog.openAddNodeBox = function(){
    var element = $("#agens-node-box");
    element.find("#property-node-name").val("node#0");
    element.find("#property-node-props").val(`{\n  "label": ""\n}`);
    element.find("#property-node-width").val('40px');
    element.find("#property-node-height").val('40px');
    element.find("#property-node-color").val("c80000");
    element.find("#property-node-shape").val("rectangle");
    element.find("#property-node-border-color").val("000000");

    element.dialog( agens.dialog.setting.addNode );
    element.dialog( "open" );
  }

  agens.dialog.openPropertyBox = function( ele ){
    var element = null;
    var props = {};
    if(!!ele.data('props')) props = ele.data('props');

    // Node Property
    if( ele.isNode() ){
      element = $("#agens-node-box");
      element.find("#property-node-id").val(ele.id());
      element.find("#property-node-name").val(ele.data('name'));
      element.find("#property-node-props").val(JSON.stringify( props, null, 2 ));
      element.find("#property-node-width").val(ele.style("width"));
      element.find("#property-node-height").val(ele.style("height"));
      element.find("#property-node-color").val(ele.style("background-color").replace('#',''));
      element.find("#property-node-shape").val(ele.style("shape"));
      element.find("#property-node-border-color").val(ele.style("border-color").replace('#',''));
      element.dialog( agens.dialog.setting.nodeProperty );
      updateBackgroundColor("property-node-color",ele.style("background-color"));
    }
    // Edge Property
    else {
      element = $("#agens-edge-box");
      element.find("#property-edge-id").val(ele.id());
      element.find("#property-edge-name").val(ele.data('name'));
      element.find("#property-edge-props").val(JSON.stringify( props, null, 2 ));
      element.find("#property-edge-width").val(ele.style("width"));
      element.find("#property-edge-color").val(ele.style("background-color").replace('#',''));
      element.dialog( agens.dialog.setting.edgeProperty );
      updateBackgroundColor("property-edge-color",ele.style("background-color"));
    }

    element.dialog( "open" );
  }

  agens.dialog.openImageExport = function(){
    var element = $("#agens-image-export");
    var png64 = agens.cy.png({scale : 3, full : true });
    element.find("img").attr("src", png64);
    element.find("#image-export-filename").val('agens-graph-export');
    element.find("#image-export-bgcolor").val('FFFFFF');
    element.find('#image-export-wrap')[0].style.backgroundColor = "#"+element.find("#image-export-bgcolor").val();
    element.dialog( agens.dialog.setting.imageExport );
    element.dialog( "open" );
  }

  agens.dialog.openJsonExport = function(){
    var element = $("#agens-json-export");
    // element.find("#json-export-file-name").val(ele.data('name'));
    element.dialog( agens.dialog.setting.JsonExport );
    element.dialog( "open" );
  }

  /////////////////////////////////////////////////////////
  console.log("agens-graph.js is loaded!");
 
}( window.agens = window.agens || {}, jQuery ));

// see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

function onImageExportChangeColor(jscolor){
  $('#image-export-wrap')[0].style.backgroundColor = "#"+jscolor;
}

function onImageExportChangeWatermark(){
  $("#image-export").watermark({
    text: document.getElementById("image-export-watermark").value,
    textWidth: 130,
    textSize: 40,
    opacity: 0.7,
    textColor: "#000",
    outputType: "png",
    fail: function(){console.log("FAILURE");}
  });
}

function updateBackgroundColor(id, jscolor) {
  // 'jscolor' instance can be used as a string
  document.getElementById(id).style.backgroundColor = jscolor;
  document.getElementById(id).value = jscolor;
}