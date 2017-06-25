package net.bitnine.agensbrowser.bundle.service;

import java.util.List;

import net.bitnine.agensbrowser.bundle.model.ConnectRequest;
import net.bitnine.agensbrowser.bundle.model.LabelMetaRequest;
import net.bitnine.agensbrowser.bundle.model.ResultResponse;
import net.bitnine.agensbrowser.bundle.model.meta.AgensDatabase;
import net.bitnine.agensbrowser.bundle.model.meta.AgensProperty;

public interface AgensMetaService {

	public void loadAgensMeta(ConnectRequest cr);	
	
	public AgensDatabase getMetaBySessionId(String sessionId);
	
	public boolean addConnection(ConnectRequest cr);

	public boolean removeConnection(String sessionId);

	public boolean isAlive(String sessionId);

	public List<AgensProperty> getLabelProperties(LabelMetaRequest param);
	
	public Long getLabelCount(LabelMetaRequest param);
	
	public void query(ResultResponse result);
	
}
