package net.bitnine.agensbrowser.bundle.model;

public class QueryRequest extends BaseRequest {

	public String sql = "";

	@Override
	public String toString() {
		return "QueryRequest [sql='" + sql + "']";
	}
	
}
