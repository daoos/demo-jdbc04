package net.bitnine.agensbrowser.bundle.util;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import net.bitnine.agensgraph.graph.Edge;
import net.bitnine.agensgraph.graph.Path;
import net.bitnine.agensgraph.graph.Vertex;

public class AgensJsonParser {

	/*
	 * ** 참고
	 * https://www.postgresql.org/message-id/AANLkTikkkxN+-UUiGVTzj8jdfS4PdpB8_tDONMFHNqHk@mail.gmail.com
	 */
	public static String mappingType(String colType){		
		String mappedType = colType;
		if( colType.startsWith("int") ) mappedType = "int";
		else if( colType.startsWith("decimal") ) mappedType = "int";
		else if( colType.startsWith("numeric") ) mappedType = "int";
		else if( colType.startsWith("float") ) mappedType = "float";
		return mappedType;
	}
	
	@SuppressWarnings("unchecked")
	public static JSONObject parseJsonStr(String str){
		JSONParser parser = new JSONParser();
		JSONObject json = null;
		
		try {
			json = (JSONObject) parser.parse( str );
		} catch (ParseException e) {
			e.printStackTrace();
			
			json = new JSONObject();
			json.put( "error", "parseJsonb");
			json.put( "string", str);
		}
		
		return json;
	}
	
	@SuppressWarnings("unchecked")
	public static JSONObject parseVertex(Vertex vertex){
    	JSONObject vcol = new JSONObject();
    	if( vertex == null ) return vcol;
    	
		vcol.put("label", vertex.getLabel() );
		vcol.put("vid", vertex.getVertexId().toString() );
		vcol.put("props", parseJsonStr( vertex.getProperty().toString() ));		
		return vcol;
	}

	@SuppressWarnings("unchecked")
	public static JSONObject parseEdge(Edge edge){
    	JSONObject ecol = new JSONObject();
    	if( edge == null ) return ecol;
    	
		ecol.put("label", edge.getLabel() );
		ecol.put("eid", edge.getEdgeId().toString() );
		ecol.put("svid", edge.getStartVertexId().toString() );
		ecol.put("evid", edge.getEndVertexid().toString() );
		ecol.put("props", parseJsonStr( edge.getProperty().toString() ));
		return ecol;
	}

	/*
	"rows":[
	{
		"type": "graphpath",
		"value": "[
	
			production[4.7058]{
			\"id\": 51, \"kind\": \"episode\", \"title\": \"Haunted House\", \"md5sum\": \"9fae28455fdcdbcb6a725e501abea51a\", \"full_info\": [{\"tech info\": \"CAM:Arri Alexa\"}, {\"tech info\": \"CAM:Canon 5D Mark II SLR Camera, Canon Lenses\"}, {\"release dates\": \"Australia:26 November 2013\"}], \"season_nr\": 1, \"episode_nr\": 6, \"phonetic_code\": \"H532\", \"production_year\": 2013
			},
			produced[9.5][5.147917,4.7058]{
			},
			company[5.147917]{
			\"id\": 104142, \"name\": \"Ludo Studio\", \"md5sum\": \"fd0519f468a5b6d8cebaf25be83bf3f8\", \"country_code\": \"[au]\", \"name_pcode_nf\": \"L323\", \"name_pcode_sf\": \"L323\"
			}
		]"
	}]
	"message": "Could not write JSON document: Direct self-reference leading to cycle (through reference chain: 
		net.bitnine.agensbrowser.bundle.model.ResultResponse[\"rows\"]
		->java.util.ArrayList[0]
		->org.json.simple.JSONArray[0]
		->org.json.simple.JSONObject[\"vertexes\"]
		->java.util.ArrayList[0]
		->net.bitnine.agensgraph.graph.Vertex[\"property\"]
		->net.bitnine.agensgraph.graph.property.JsonObject[\"jsonValue\"]); 
	*/		            	
	@SuppressWarnings("unchecked")
	public static JSONObject parsePath(Path path){
		JSONObject pcol = new JSONObject();
		if( path == null ) return pcol;

		// pcol.put("value", path.getValue());
		pcol.put("svertex", parseVertex( path.start() ));
		pcol.put("evertex", parseVertex( path.end() ));
		JSONArray vertexes = new JSONArray();
		for(Vertex vertex : path.vertexs()){
			vertexes.add( parseVertex( vertex ));
		}
		pcol.put("vertexes", vertexes);
		JSONArray edges = new JSONArray();
		for(Edge edge : path.edges()){
			edges.add( parseEdge( edge ));
		}
		pcol.put("edges", edges);
		return pcol;
	}
	
}
