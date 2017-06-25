package net.bitnine.agensbrowser.bundle.repository;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import net.bitnine.agensbrowser.bundle.model.meta.AgensDatabase;
import net.bitnine.agensbrowser.bundle.model.meta.AgensGraph;
import net.bitnine.agensbrowser.bundle.model.meta.AgensLabel;
import net.bitnine.agensbrowser.bundle.model.meta.AgensProperty;

public interface AgensMetaRepository {

	void initialize(DataSource dataSource);
	boolean testConnect();
	
	public boolean disconnect();
	
	AgensDatabase loadMetaDatabase(String db);
	List<AgensGraph> loadMetaGraphs();
	List<AgensLabel> loadMetaLabels();
	List<AgensProperty> loadMetaProperties(String graph, String label);
	
	void loadMetaLabelCount(List<AgensLabel> labels);	
	Long countLabel(String graph, String label);

	List<JSONArray> query(String sql, List<Map<String,String>> meta);
	
}
