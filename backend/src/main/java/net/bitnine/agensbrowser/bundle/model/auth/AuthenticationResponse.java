package net.bitnine.agensbrowser.bundle.model.auth;

import java.io.Serializable;


public class AuthenticationResponse implements Serializable {

	private static final long serialVersionUID = 662071956353341023L;
	
	private final String token;

    public AuthenticationResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return this.token;
    }
}