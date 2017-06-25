package net.bitnine.agensbrowser.bundle.exception;

import org.springframework.security.core.AuthenticationException;


public class IPBlockedException extends AuthenticationException{

	private static final long serialVersionUID = 2861949599874078312L;

	public IPBlockedException(String message) {
        super(message);
    }
    
}