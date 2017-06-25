package net.bitnine.agensbrowser.bundle.model;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class ResultResponse {

	private final QueryRequest query;
	
	private List<Map<String,String>> meta = null;
	private List<JSONArray> rows = null;
	
	private Integer size = -1;
	private String message = "";
	private Timestamp finishTime = null;
	
	public ResultResponse(QueryRequest query){
		this.query = query;
	}

	public List<Map<String, String>> getMeta() {
		return meta;
	}
	public void setMeta(List<Map<String, String>> meta) {
		this.meta = meta;
	}

	public List<JSONArray> getRows() {
		return rows;
	}
	public void setRows(List<JSONArray> rows) {
		this.rows = rows;
		if( rows != null ) this.size = rows.size();
	}
	public Integer getSize() {
		return size;
	}

	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}

	public QueryRequest getQuery() {
		return query;
	}
	public Timestamp getFinishTime() {
		return finishTime;
	}
	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

}