package net.bitnine.agensbrowser.bundle.repository;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.json.simple.JSONArray;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
//import org.json.simple.JSONObject;
//import org.json.simple.parser.JSONParser;
//import org.json.simple.parser.ParseException;
//import org.postgresql.core.Parser;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import net.bitnine.agensgraph.graph.Edge;
//import net.bitnine.agensgraph.graph.GID;
import net.bitnine.agensgraph.graph.Path;
import net.bitnine.agensgraph.graph.Vertex;
import net.bitnine.agensgraph.graph.property.Jsonb;
import net.bitnine.agensbrowser.bundle.model.meta.AgensDatabase;
import net.bitnine.agensbrowser.bundle.model.meta.AgensGraph;
import net.bitnine.agensbrowser.bundle.model.meta.AgensLabel;
import net.bitnine.agensbrowser.bundle.model.meta.AgensProperty;
import net.bitnine.agensbrowser.bundle.util.AgensJsonParser;

public class AgensMetaRepositoryImpl extends JdbcDaoSupport implements AgensMetaRepository  {

	@Value("${agens.config.max_rows_num}")
	private int MAX_ROWS_NUM;
	
	public AgensMetaRepositoryImpl(DataSource dataSource){
		setDataSource(dataSource);
	}
	
	@Override
	public void initialize(DataSource dataSource){
		setDataSource(dataSource);
	}

	@Override
	public boolean testConnect(){
		String sql = "SELECT 1+0";
		Integer result = getJdbcTemplate().queryForObject(sql, new Object[] {}, Integer.class);		
		return result.equals(1) ? true : false;
	}

	@Override
	public boolean disconnect(){
		Connection conn = this.getConnection();
		if( conn != null ){
			this.releaseConnection(conn);
			return true;
		}
		return false;
	}
	
	@Override
	public AgensDatabase loadMetaDatabase(String db) {
		String sql = "SELECT d.oid as db_oid, d.datname AS db_name,"
				+ " pg_catalog.pg_get_userbyid(d.datdba) AS db_owner,"
				+ " coalesce(null, s.description, '') AS db_desc"
				+ " FROM pg_database d"
				+ " LEFT OUTER JOIN pg_shdescription s ON d.oid = s.objoid"
				+ " WHERE d.datname = '"+db+"'";
		
		logger.info(sql);
		return (AgensDatabase)getJdbcTemplate().queryForObject(sql, 
				new RowMapper<AgensDatabase>(){
			@Override
			public AgensDatabase mapRow(ResultSet rs, int rwNumber) throws SQLException {
				AgensDatabase metaDb = new AgensDatabase();
				metaDb.oid = rs.getLong(1);
				metaDb.name = rs.getString(2);
				metaDb.owner = rs.getString(3);
				metaDb.desc = rs.getString(4);
				return metaDb;
			}
		});
	}

	@Override
	public List<AgensGraph> loadMetaGraphs() {
		String sql = "SELECT g.oid as gr_oid, g.graphname as gr_name," 
				+ " coalesce(null, pg_catalog.obj_description(g.oid), '') as gr_desc"
				+ " FROM pg_catalog.ag_graph g"
				+ " LEFT JOIN pg_catalog.pg_class c on c.oid = g.oid"
				+ " ORDER BY g.oid";

		logger.info(sql);
		List<AgensGraph> graphs = (List<AgensGraph>)getJdbcTemplate().query(sql, 
				new RowMapper<AgensGraph>(){
			@Override
			public AgensGraph mapRow(ResultSet rs, int rwNumber) throws SQLException {
				AgensGraph graph = new AgensGraph();
				graph.oid = rs.getLong(1);
				graph.name = rs.getString(2);
				graph.desc = rs.getString(3);
				return graph;
			}
		});
		return graphs;
	}

	/*
        {
          "g_oid": 241094,
          "oid": 241134,
          "type": "v",
          "name": "person",
          "owner": "agraph",
          "desc": "",
          "count_sql": "SELECT count(id) as cnt FROM imdb_graph.person",
          "count": 6053766
        },
	 */
	@Override
	public List<AgensLabel> loadMetaLabels() {
		String sql = "SELECT l.graphid as gr_oid, g.graphname as gr_name,"
				+ " l.oid as la_oid, l.labname as la_name, l.labkind as la_type,"
				+ " pg_catalog.pg_get_userbyid(c.relowner) as la_owner,"
				+ " coalesce(null, pg_catalog.obj_description(l.oid, 'ag_label'), '') as la_desc"
				+ " FROM pg_catalog.ag_label l"
				+ " INNER JOIN pg_catalog.ag_graph g ON g.oid = l.graphid"
				+ " LEFT OUTER JOIN pg_catalog.pg_class c ON c.oid = l.relid"
				+ " WHERE l.labname not in ('ag_vertex', 'ag_edge')"
				+ " ORDER BY l.graphid, l.oid";

		logger.info(sql);
		List<AgensLabel> labels = (List<AgensLabel>)getJdbcTemplate().query(sql, 
				new RowMapper<AgensLabel>(){
			@Override
			public AgensLabel mapRow(ResultSet rs, int rwNumber) throws SQLException {
				AgensLabel label = new AgensLabel();
				label.g_oid = rs.getLong(1);
				label.g_name = rs.getString(2);
				label.oid = rs.getLong(3);
				label.name = rs.getString(4);
				label.type = rs.getString(5);
				label.owner = rs.getString(6);
				label.desc = rs.getString(7);
				return label;
			}
		});
		return labels;
	}

	@Override
	public List<AgensProperty> loadMetaProperties(String graph, String label) {
		String sql = "SELECT json_data.key as json_key,"
				+ " jsonb_typeof(json_data.value) as json_type,"
				+ " count(*) as key_count"
				+ " FROM "+graph+"."+label+", jsonb_each("+graph+"."+label+".properties) AS json_data"
				+ " WHERE "+graph+"."+label+".properties <> '{}' and jsonb_typeof(json_data.value) <> 'null'"
				+ " group by 1, 2 order by 1, 2";
		
		logger.info(sql);
		List<AgensProperty> properties = (List<AgensProperty>)getJdbcTemplate().query(sql, 
				new RowMapper<AgensProperty>(){
			@Override
			public AgensProperty mapRow(ResultSet rs, int rwNumber) throws SQLException {
				AgensProperty property = new AgensProperty();
				property.key = rs.getString(1);
				property.type = rs.getString(2);
				property.count = rs.getLong(3);
				return property;
			}
		});
		return properties;
	}

	@Override
	public void loadMetaLabelCount(List<AgensLabel> labels) {
		int leave = labels.size();
		for( AgensLabel label : labels ){
			if( !label.loaded_count ){

				String sql = "SELECT count(properties) as tot_cnt, sum( case when properties = '{}' then 0 else 1 end ) as json_cnt"
						+ " from "+label.g_name+"."+label.name;
//				logger.info(sql);
				List<List<Long>> result = getJdbcTemplate().query(sql, 
						new RowMapper<List<Long>>(){
					@Override
					public List<Long> mapRow(ResultSet rs, int rwNumber) throws SQLException {
						List<Long> counts = new ArrayList<Long>();
						counts.add( rs.getLong(1) );
						counts.add( rs.getLong(2) );
						return counts;
					}
				});
								
				label.count = result.get(0).get(0);
				label.loaded_count = true;
				// count(distinct properties) == 1 이면 모든 properties가 비어있는 것을 의미
				if( result.get(0).get(1) == 0L ) label.loaded_properties = true;
			}
			logger.info(String.format("label[%03d] count of '%s' = %d (%s)", leave--, 
					label.name, label.count, String.valueOf(label.loaded_properties) ));	
		}
	}

	@Override
	public Long countLabel(String graph, String label) {
		String sql = "SELECT count(id) from "+graph+"."+label;
		Long result = getJdbcTemplate().queryForObject(sql, new Object[] {}, Long.class);				
		return result;
	}
	
	/*
	 * 	참고 http://stackoverflow.com/questions/32661579/loading-json-from-postgres-column-via-jdbc
	 *	ResultSet => JSONObject 변환 필요
	 * 
	 *   "message": "Could not write JSON document: Direct self-reference leading to cycle (through reference chain: 
	 *   	net.bitnine.agensbrowser.bundle.model.ResultResponse[\"rows\"]
	 *   	->java.util.ArrayList[0]
	 *   	->java.util.ArrayList[0]
	 *   	->org.json.simple.JSONObject[\"props\"]
	 *   	->net.bitnine.agensgraph.graph.property.JsonObject[\"jsonValue\"]); 
	 *   
	 *   nested exception is com.fasterxml.jackson.databind.JsonMappingException: 
	 *   	Direct self-reference leading to cycle (through reference chain: 
	 *   	net.bitnine.agensbrowser.bundle.model.ResultResponse[\"rows\"]
	 *   	->java.util.ArrayList[0]
	 *   	->java.util.ArrayList[0]
	 *   	->org.json.simple.JSONObject[\"props\"]
	 *   	->net.bitnine.agensgraph.graph.property.JsonObject[\"jsonValue\"])"
	 */
	@Override
	public List<JSONArray> query(String sql, List<Map<String,String>> meta){
		System.out.println("** query =>\n"+sql);

		JdbcTemplate stmt = getJdbcTemplate();
		stmt.setMaxRows( MAX_ROWS_NUM );		// limit 옵션이 먹지 않는다!!
		List<JSONArray> rows = stmt.query(sql, 
				new RowMapper<JSONArray>(){
			@SuppressWarnings("unchecked")
			@Override
			public JSONArray mapRow(ResultSet rs, int rwNumber) throws SQLException {
				
				// MetaData 추출
				ResultSetMetaData rsmd = rs.getMetaData();
			    int columnCount = rsmd.getColumnCount();
			    if( meta.size() != columnCount ){
			    	meta.clear();
			    	// 첫번째 컬럼은 row의 순번을 의미하는 'rowNum'으로 설정
		    		Map<String,String> col0 = new HashMap<String,String>();
		    		col0.put("label", "rowNum"); col0.put("type", "int"); meta.add(col0);
		    		// 이후 쿼리 결과에 대한 컬럼 메타데이터 추가
			    	for (int i = 0; i < columnCount; i++) {
			    		Map<String,String> column = new HashMap<String,String>();
			    		column.put("label", rsmd.getColumnLabel(i+1).toLowerCase());
			    		column.put("type", AgensJsonParser.mappingType( rsmd.getColumnTypeName(i+1).toLowerCase() ));
			            meta.add(column);
			    	}
			    }
			    
			    // RowData 추출
			    JSONArray row = new JSONArray();
			    row.add(rwNumber+1);		// rowNum : start from '1' ~ to the end
	            for (int i = 0; i < columnCount; i++) {
	            	String colType  = meta.get(i+1).get("type").toLowerCase();
				    
	            	switch( colType ){
	            	case "vertex": 
	            		row.add( AgensJsonParser.parseVertex( (Vertex)rs.getObject(i+1) ));
	            		break;
	            	case "edge": 
	            		row.add( AgensJsonParser.parseEdge( (Edge)rs.getObject(i+1) ));
	            		break;
	            	case "graphpath":
	            		row.add( AgensJsonParser.parsePath( (Path)rs.getObject(i+1) ));
	            		break;
	            	case "jsonb": 
	            		row.add(AgensJsonParser.parseJsonStr( ((Jsonb)rs.getObject(i+1)).toString() ));	            		
	            		break;
	            	case "graphid": 
	            		row.add( rs.getObject(i+1).toString() );
	            		break;
	            	default:
	            		// [DEBUG] text, number 등의 일반 데이터타입 아니면 출력
	            		if( !colType.equals("text") && !colType.equals("int") && !colType.equals("float") )
	            			System.out.println(String.format("[mapper] type=%s, value=%s", colType, rs.getObject(i+1).toString()));
	            		
	            		row.add( rs.getObject(i+1) );
	            	}
	            }

	            return row;
			}
		});
		return rows;
	}
	
	/*
	 ** PATH 
{ 
	"sql" : "match path=(a:production {'title': 'Haunted House'})-[]-(b:company {'name': 'Ludo Studio'}) return path limit 10" 
}
	 ** EDGE
{ 
	"sql" : "match ()-[a:keyword_of]-() return a limit 20" 
}
	 ** VERTEX
{ 
	"sql" : "match (a:production {'kind': 'episode'}) return a limit 20" 
}
	 ** JSONB
{ 
	"sql" : "match (a:production) where a.production_year::int > 2000 return a.production_year::int as prod_year, properties(a) as jsons limit 10" 
}
	 ** GRAPHID & others
{ 
	"sql" : "match (a)<-[c:produced]-(b) return id(a), label(a), a.title, id(b), label(b), b.name, label(c), id(c) limit 10" 
}
	 *
	 */
}