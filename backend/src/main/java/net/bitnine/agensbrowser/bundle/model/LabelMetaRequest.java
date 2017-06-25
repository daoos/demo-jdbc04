package net.bitnine.agensbrowser.bundle.model;

public class LabelMetaRequest extends BaseRequest {

	public String graph = "";
	public String type = "";
	public String name = "";
	
	@Override
	public String toString() {
		return "LabelMetaRequest [graph=" + graph + ", type=" + type + ", name=" + name + "]";
	}		
	
}
