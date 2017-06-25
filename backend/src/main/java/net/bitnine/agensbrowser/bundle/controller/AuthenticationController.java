package net.bitnine.agensbrowser.bundle.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mobile.device.Device;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import net.bitnine.agensbrowser.bundle.model.AdminLock;
import net.bitnine.agensbrowser.bundle.model.AdminSession;
import net.bitnine.agensbrowser.bundle.model.auth.AuthenticationRequest;
import net.bitnine.agensbrowser.bundle.model.auth.AuthenticationResponse;
import net.bitnine.agensbrowser.bundle.model.auth.IPWhitelist;
import net.bitnine.agensbrowser.bundle.model.auth.RegisterUserRequest;
import net.bitnine.agensbrowser.bundle.model.auth.User;
import net.bitnine.agensbrowser.bundle.service.AgensAdminService;
import net.bitnine.agensbrowser.bundle.service.auth.UserService;
import net.bitnine.agensbrowser.bundle.util.TokenUtil;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;


@RestController
public class AuthenticationController {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	
    @Value("${jwt.header}")
    private String tokenHeader;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private AgensAdminService adminService;

    @RequestMapping(value = "${jwt.route.authentication.path}", method = RequestMethod.POST)
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest, Device device) throws AuthenticationException, Exception {

        userService.isIPOK();

        // Perform the security
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getUsername(),
                        authenticationRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Reload password post-security so we can generate token
        final UserDetails userDetails = userService.loadUserByUsername(authenticationRequest.getUsername());

        final String token = jwtTokenUtil.generateToken(userDetails, device);

        // Return the token
        return ResponseEntity.ok(new AuthenticationResponse(token));
    }

    @RequestMapping(value = "${jwt.route.authentication.refresh}", method = RequestMethod.GET)
    public ResponseEntity<?> refreshAndGetAuthenticationToken(HttpServletRequest request) throws Exception {
        
        userService.isIPOK();
        
        String token = request.getHeader(tokenHeader);
        String username = jwtTokenUtil.getUsernameFromToken(token);
        User user = (User) userService.loadUserByUsername(username);

        if (jwtTokenUtil.canTokenBeRefreshed(token, user.getLastPasswordResetDate())) {
            String refreshedToken = jwtTokenUtil.refreshToken(token);
            return ResponseEntity.ok(new AuthenticationResponse(refreshedToken));
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    ////////////////////////////////////////////////////////
    
    @RequestMapping(value = "${jwt.route.authentication.path}/users"
    		, method = RequestMethod.GET
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> listUsers(Device device) throws Exception {

        // Reload password post-security so we can generate token
        final List<User> list = userService.listUsers();
        if( list == null ){
            return ResponseEntity.badRequest().body(null);
        }

        // Return the token
        return ResponseEntity.ok(list);
    }

    @RequestMapping(value = "${jwt.route.authentication.path}/user/register"
    		, method = RequestMethod.POST
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> registerUser(@RequestBody RegisterUserRequest request, Device device) throws Exception {
    	
    	logger.info("registerUser: "+request.toString());
    	
        // Reload password post-security so we can generate token
    	request.setUsername( request.getUsername().toLowerCase() );
        final User user = userService.registerUser(request);
        if( user == null ){
            return ResponseEntity.badRequest().body(null);
        }
        
        // Return the newUser
        return ResponseEntity.ok(user);
    }

    @RequestMapping(value = "${jwt.route.authentication.path}/user/unregister"
    		, method = RequestMethod.POST
    		, produces = {"application/json", "application/xml"})
    public ResponseEntity<?> unregisterUser(@RequestBody Map<String,String> request, Device device) throws Exception {
    	
    	String username = request.get("username");
        if( username == null ){
            return ResponseEntity.badRequest().body(null);
        }
    	username = username.toLowerCase();
    	logger.info("unregisterUser: "+username);
    	
        // Reload password post-security so we can generate token
        final User user = userService.unregisterUser(username);
        if( user == null ){
            return ResponseEntity.badRequest().body(null);
        }
        
        // Return the newUser
        return ResponseEntity.ok(user);
    }

    @RequestMapping(value = "${jwt.route.authentication.path}/ips"
    		, method = RequestMethod.GET
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> listIps(Device device) throws Exception {

        // Reload password post-security so we can generate token
        final List<IPWhitelist> list = userService.listIps();
        if( list == null ){
            return ResponseEntity.badRequest().body(null);
        }

        // Return the token
        return ResponseEntity.ok(list);
    }

    @RequestMapping(value = "${jwt.route.authentication.path}/ip/register"
    		, method = RequestMethod.POST
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> registerIp(@RequestBody IPWhitelist request, Device device) throws Exception {
    	
    	logger.info("registerUser: "+request.toString());
    	
        // Reload password post-security so we can generate token
        userService.addIpWhiteList(request);
        
        // Return the newUser
        return ResponseEntity.ok( String.format("White IP '%s' is registered", request.getIpAddr()) );
    }

    @RequestMapping(value = "${jwt.route.authentication.path}/ip/unregister"
    		, method = RequestMethod.POST
    		, produces = {"application/json", "application/xml"})
    public ResponseEntity<?> unregisterIp(@RequestBody Map<String,String> request, Device device) throws Exception {
    	
    	String ipAddr = request.get("ipAddr");
        if( ipAddr == null ){
            return ResponseEntity.badRequest().body(null);
        }
    	
    	logger.info("unregisterIp: "+ipAddr);
        // Reload password post-security so we can generate token
        final IPWhitelist ip = userService.unregisterIp(ipAddr);
        if( ip == null ){
            return ResponseEntity.badRequest().body(null);
        }
        
        // Return the newUser
        return ResponseEntity.ok(ip);
    }

    ////////////////////////////////////////////////////////////////////

    @RequestMapping(value = "${jwt.route.authentication.path}/sessions"
    		, method = RequestMethod.GET
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> listSessions(Device device) throws Exception {

        // Reload password post-security so we can generate token
        final List<AdminSession> list = adminService.getSessions();
        if( list == null ){
            return ResponseEntity.badRequest().body(null);
        }

        // Return the token
        return ResponseEntity.ok(list);
    }

    @RequestMapping(value = "${jwt.route.authentication.path}/locks"
    		, method = RequestMethod.GET
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> listLocks(Device device) throws Exception {

        // Reload password post-security so we can generate token
        final List<AdminLock> list = adminService.getLocks();
        if( list == null ){
            return ResponseEntity.badRequest().body(null);
        }

        // Return the token
        return ResponseEntity.ok(list);
    }

}