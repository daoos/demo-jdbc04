package net.bitnine.agensbrowser.bundle.service.auth;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import net.bitnine.agensbrowser.bundle.config.SecurityUtil;
import net.bitnine.agensbrowser.bundle.exception.IPBlockedException;
import net.bitnine.agensbrowser.bundle.exception.InvalidInputException;
import net.bitnine.agensbrowser.bundle.model.auth.Authority;
import net.bitnine.agensbrowser.bundle.model.auth.IPWhitelist;
import net.bitnine.agensbrowser.bundle.model.auth.RegisterUserRequest;
import net.bitnine.agensbrowser.bundle.model.auth.User;
import net.bitnine.agensbrowser.bundle.repository.auth.AuthorityRepository;
import net.bitnine.agensbrowser.bundle.repository.auth.IPWhitelistRepository;
import net.bitnine.agensbrowser.bundle.repository.auth.UserRepository;


@Service
public class UserServiceImpl implements UserService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private IPWhitelistRepository iPWhitelistRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        logger.info(String.format("Load user by username '%s'.", username));
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Invalid credential");
        } else {
            return user;
        }
        
    }

    @Override
    public void addUser(User user) throws InvalidInputException {
    	
        if (user == null) {
            throw new InvalidInputException("Invalid input user");
        } else {
            logger.info(String.format("Add User '%s'.", user.getUsername()));
            user.setPassword(passwordEncoder.encode(user.getUsername()));
            userRepository.save(user);
        }
        
    }

    @Override
    public void addAuthority(Authority authority) throws InvalidInputException {
    	
        if (authority == null) {
            throw new InvalidInputException("Invalid input authority");
        } else {
            logger.info(String.format("Add Authority '%s'.", authority.getAuthority()));
            authorityRepository.save(authority);
        }

    }

    @Override
    public void isIPOK() throws AuthenticationException {

        String ip = SecurityUtil.getClientIP(request);
        logger.info(String.format("Load Ip '%s'.", ip));

        IPWhitelist ipw = iPWhitelistRepository.findByIpAddr(ip);

        if (ipw == null) {
            throw new IPBlockedException("Invalid IP");
        }

    }

    @Override
    public void addIpWhiteList(IPWhitelist iPWhitelist) throws InvalidInputException {
    	
        if (iPWhitelist == null) {
            throw new InvalidInputException("Invalid input ip");
        } else {
            logger.info(String.format("Add whitelist ip '%s'.", iPWhitelist.getIpAddr()));            
            iPWhitelistRepository.save(iPWhitelist);
        }
    }
    @Override
    public IPWhitelist unregisterIp(String ipAddr) throws InvalidInputException {

        logger.info(String.format("Remove IP '%s'.", ipAddr));
        IPWhitelist ip = iPWhitelistRepository.findByIpAddr(ipAddr);
        if( ip == null ){
            throw new InvalidInputException("Invalid input ipAddr");
        }
        
        iPWhitelistRepository.delete(ip);
    	return ip;
    }
    
    @Override
    public List<User> listUsers(){
    	return userRepository.findAll();
    }
    @Override
    public List<IPWhitelist> listIps(){
    	return iPWhitelistRepository.findAll();
    }

    @Override
	public User registerUser(RegisterUserRequest request){

        logger.info(String.format("Add User '%s'.", request.getUsername()));
        User newUser = new User(request.getUsername(), request.getFirstname(), request.getLastname(), request.getEmail() );       
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        
        Set<Authority> authorities = new HashSet<Authority>();
        for( String item : request.getRoleList() ){
            authorities.add( authorityRepository.findByName(item) ); 
        }
        newUser.setAuthorities(authorities);
        
        userRepository.save(newUser);        
    	return newUser;
    }

    @Override
    public User unregisterUser(String username) throws InvalidInputException {

        logger.info(String.format("Remove User '%s'.", username));
        User user = userRepository.findByUsername(username);
        if( user == null ){
            throw new InvalidInputException("Invalid input username");
        }
        
        userRepository.delete(user);
    	return user;
    }

}