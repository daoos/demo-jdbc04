package net.bitnine.agensbrowser.bundle.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.sql.DataSource;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;
import org.springframework.stereotype.Service;

import net.bitnine.agensbrowser.bundle.model.ConnectRequest;
import net.bitnine.agensbrowser.bundle.model.LabelMetaRequest;
import net.bitnine.agensbrowser.bundle.model.ResultResponse;
import net.bitnine.agensbrowser.bundle.model.meta.AgensDatabase;
import net.bitnine.agensbrowser.bundle.model.meta.AgensGraph;
import net.bitnine.agensbrowser.bundle.model.meta.AgensLabel;
import net.bitnine.agensbrowser.bundle.model.meta.AgensProperty;
import net.bitnine.agensbrowser.bundle.repository.AgensMetaRepository;
import net.bitnine.agensbrowser.bundle.repository.AgensMetaRepositoryImpl;


@Service
public class AgensMetaServiceImpl implements AgensMetaService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Value("${agens.config.app_name}")
	private String appName;

	private Map<String,ConnectRequest> connMap = new HashMap<String,ConnectRequest>();
	private Map<String,AgensDatabase> metaMap = new HashMap<String,AgensDatabase>();

	@Override
	public void loadAgensMeta(ConnectRequest cr) {

		AgensMetaRepository repository = cr.getRepository();
		if( repository == null ){
			logger.error(String.format("loadAgensMeta(): repository not found [%s:%s/%s]", cr.host, cr.port, cr.db));
			return;
		}
		
		// load meta-info of DB
		AgensDatabase meta = repository.loadMetaDatabase(cr.db);		
		// load meta-info of Graphs
		meta.graphs = repository.loadMetaGraphs();
		// load meta-info of Labels
		List<AgensLabel> labels = repository.loadMetaLabels();

		// graph에 하위 label들 mapping 하기
		for( AgensLabel label : labels ){
			AgensGraph graph = findAgensGraphByOid(meta.graphs, label.g_oid);
			if( graph != null ){
				if(label.type.equalsIgnoreCase("v")){
					label.type = "vertex";
					graph.vertexes.add(label);
				}
				else if(label.type.equalsIgnoreCase("e")){
					label.type = "edge";
					graph.edges.add(label);
				}
			}
		}

		// NOTE: 너무 오래 걸림
		// => meta 질의 이후에 클라이언트에서 따로 count_label 요청을 하는 것으로 변경 
		repository.loadMetaLabelCount(labels);
		
		metaMap.put(cr.getSessionId(), meta);
	}
	
	private AgensGraph findAgensGraphByOid(List<AgensGraph> graphs, Long oid){
		if( graphs == null ) return null;
		for( AgensGraph graph : graphs ){
			if( graph.oid.equals(oid) ) return graph;
		}
		return null;
	}
/*	
	@SuppressWarnings("unused")
	private AgensLabel findAgensLabelByOid(Long oid){
		if( this.labels == null ) return null;
		
		for( AgensLabel label : this.labels ){
			if( label.oid == oid ) return label;
		}
		return null;
	}
*/
	@Override
	public AgensDatabase getMetaBySessionId(String sessionId){
		// 기존에 저장해 둔 meta 객체 있으면 반환
		AgensDatabase db = this.metaMap.get(sessionId);
		if( db != null ) return db;
		
		// 없으면 새로 meta 질의
		ConnectRequest cr = this.connMap.get(sessionId);
		if( cr != null ) this.loadAgensMeta(cr);		
		return this.metaMap.get(sessionId);
	}
	
	@Override
	public boolean addConnection(ConnectRequest cr){
		String dbUrl = String.format("jdbc:agensgraph://%s:%s/%s", cr.host, cr.port, cr.db);
/*
		DataSource dataSource = null;
		try{
			dataSource = DataSourceBuilder.create()
		        .driverClassName("net.bitnine.agensgraph.Driver")
		        .url(dbUrl)
		        .username(cr.user_id)
		        .password(cr.user_pw)
		        .build();
			// logger.info(String.format("addConnection(): trying [%s] by id[%s]", dbUrl, cr.user_id));
		}
*/
		// Connection Pool을 지원하지 않는 클래스
		// ==> connection 을 여러번 시도해도 개체가 증가하지 않는다 (바로 해제??)
		// ** 참고 https://rebeccacho.gitbooks.io/spring-study-group/content/chapter10.html
		SimpleDriverDataSource dataSource = new SimpleDriverDataSource( );
		try{
	      dataSource.setDriverClass(net.bitnine.agensgraph.Driver.class);
	      dataSource.setUrl(dbUrl);
	      dataSource.setUsername(cr.user_id);
	      dataSource.setPassword(cr.user_pw);
	      
	      Properties props = new Properties();
          props.setProperty("APPLICATIONNAME", String.format("%s<%s>", this.appName, cr.user_id));
	      dataSource.setConnectionProperties(props);
		}
		catch(Exception e){
			logger.error(String.format("addConnection(): dataSource.build FAIL!! [%s] by id[%s]", dbUrl, cr.user_id));
			e.printStackTrace();
			return false;
		}
		
		AgensMetaRepository repository = new AgensMetaRepositoryImpl(dataSource);
		if( !repository.testConnect() ){
			logger.error(String.format("addConnection(): testConnect FAIL!! [%s] by id[%s]", dbUrl, cr.user_id));
			return false;
		}
		cr.setRepository( repository );
		this.connMap.put(cr.getSessionId(), cr);
		return true;
	}

	@Override
	public boolean removeConnection(String sessionId){
		ConnectRequest cr = this.connMap.get(sessionId);
		this.connMap.remove(sessionId);
		this.metaMap.remove(sessionId);
		
		if( cr != null ){
			AgensMetaRepository repository = cr.getRepository();
			cr.setRepository(null);
			if( repository != null ){
				return repository.disconnect();				
			}
		}
		return true;
	}

	@Override
	public boolean isAlive(String sessionId){
		ConnectRequest cr = this.connMap.get(sessionId);
		if( cr == null ) return false;
		AgensMetaRepository repository = cr.getRepository();
		if( repository == null ) return false;
		
		if( !repository.testConnect() ){
			String dbUrl = String.format("jdbc:agensgraph://%s:%s/%s", cr.host, cr.port, cr.db);			
			logger.error(String.format("isAlive(): testConnect FAIL!! [%s] by id[%s]", dbUrl, cr.user_id));
			return false;
		}

		return true;
	}
	
	@Override
	public List<AgensProperty> getLabelProperties(LabelMetaRequest param){
		ConnectRequest cr = this.connMap.get(param.getSessionId());
		if( cr == null ) return (List<AgensProperty>)null;
		AgensMetaRepository repository = cr.getRepository();

		AgensDatabase db = metaMap.get(param.getSessionId());
		if( db == null ){
			return repository.loadMetaProperties(param.graph, param.name);	
		}
		
		AgensLabel label = findLabel( db, param.graph, param.type, param.name );
		if( label == null ){
			return new ArrayList<AgensProperty>();
		}
		
		if( !label.loaded_properties ){
			label.properties = repository.loadMetaProperties(param.graph, param.name);
			label.loaded_properties = true;
		}
		return label.properties;
	}
	
	@Override
	public Long getLabelCount(LabelMetaRequest param){
		ConnectRequest cr = this.connMap.get(param.getSessionId());
		if( cr == null ) return -1L;
		AgensMetaRepository repository = cr.getRepository();
		
		AgensDatabase db = metaMap.get(param.getSessionId());
		if( db == null ){
			return repository.countLabel(param.graph, param.name);
		}
		
		AgensLabel label = findLabel( db, param.graph, param.type, param.name );
		if( label == null ) return -2L;

		if( !label.loaded_count ){			
			label.count = repository.countLabel(param.graph, param.name);
			label.loaded_count = true;
		}
		return label.count;
	}
	
	private AgensLabel findLabel( AgensDatabase db, String gName, String lType, String lName){
		for( AgensGraph graph : db.graphs ){
			if( graph.name.equalsIgnoreCase(gName) ){
				List<AgensLabel> labels = lType.equals("vertex") ? graph.vertexes : graph.edges;
				for( AgensLabel label : labels ){
					if( label.name.equalsIgnoreCase(lName) ) return label;
				}
			}
		}
		return (AgensLabel)null;
	}
	
	@Override
	public void query(ResultResponse result){
		ConnectRequest cr = this.connMap.get(result.getQuery().getSessionId());
		if( cr == null ) return;

		AgensMetaRepository repository = cr.getRepository();
		
		List<Map<String,String>> meta = new ArrayList<Map<String,String>>();
		List<JSONArray> rows = repository.query(result.getQuery().sql, meta);
		result.setMeta(meta);
		result.setRows(rows);
		System.out.println(String.format("returned rows.size=%d", rows.size()));
	}

}