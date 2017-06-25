package net.bitnine.agensbrowser.bundle.model.auth;

import java.io.Serializable;

public class RegisterIpRequest implements Serializable {

	private static final long serialVersionUID = 4442152653307627662L;

	private String ip;

	public RegisterIpRequest(String ip) {
		super();
		this.ip = ip;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	@Override
	public String toString() {
		return "RegisterIpRequest [ip=" + ip + "]";
	}
	
}
