package net.bitnine.agensbrowser.bundle.model;

import java.sql.Timestamp;

public class BaseRequest {

	private String sessionId = "";
	private Long requestId = -1L;
	private Timestamp requestTime = new Timestamp(System.currentTimeMillis());

	public BaseRequest(){
	}	
	public BaseRequest(String sessionId, Long requestId){
		this.sessionId = sessionId;
		this.requestId = requestId;
	}
	
	public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public Long getRequestId() {
		return requestId;
	}
	public void setRequestId(Long requestId) {
		this.requestId = requestId;
	}
	public Timestamp getRequestTime() {
		return requestTime;
	}
	public void setRequestTime(Timestamp requestTime) {
		this.requestTime = requestTime;
	}
	
}
