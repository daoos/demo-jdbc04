package net.bitnine.agensbrowser.bundle.model;

import net.bitnine.agensbrowser.bundle.repository.AgensMetaRepository;

public class ConnectRequest {

    public String host;
    public String port;
    public String db;
    public String user_id;
    public String user_pw;
    public boolean isAdmin = true;
    
    private String sessionId = "";
    private AgensMetaRepository repository = null;
    
	public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public AgensMetaRepository getRepository() {
		return repository;
	}
	public void setRepository(AgensMetaRepository repository) {
		this.repository = repository;
	}
	@Override
	public String toString() {
		return "ConnectRequest [host=" + host + ", port=" + port + ", db=" + db + ", user_id=" + user_id + ", user_pw="
				+ user_pw + ", isAdmin=" + isAdmin + "]";
	}
	
}
