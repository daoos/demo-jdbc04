package net.bitnine.agensbrowser.bundle.service.auth;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import net.bitnine.agensbrowser.bundle.exception.InvalidInputException;
import net.bitnine.agensbrowser.bundle.model.auth.Authority;
import net.bitnine.agensbrowser.bundle.model.auth.IPWhitelist;
import net.bitnine.agensbrowser.bundle.model.auth.RegisterUserRequest;
import net.bitnine.agensbrowser.bundle.model.auth.User;


public interface UserService extends UserDetailsService {
	
    void addAuthority(Authority authority) throws Exception;
    void addUser(User user) throws Exception;
    void addIpWhiteList(IPWhitelist iPWhitelist) throws Exception;
    void isIPOK() throws Exception;
    
    List<User> listUsers();
    List<IPWhitelist> listIps();
    
	User registerUser(RegisterUserRequest request) throws InvalidInputException;
	User unregisterUser(String username) throws InvalidInputException;
//	IPWhitelist registerIp(IPWhitelist ip) throws InvalidInputException;
	IPWhitelist unregisterIp(String ipAddr) throws InvalidInputException;
    
}