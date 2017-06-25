package net.bitnine.agensbrowser.bundle.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import net.bitnine.agensbrowser.bundle.model.auth.User;
import net.bitnine.agensbrowser.bundle.service.auth.UserService;
import net.bitnine.agensbrowser.bundle.util.TokenUtil;


@RestController
public class IndexController {

    @Value("${jwt.header}")
    private String tokenHeader;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;
    
    //do not require authorization
    @GetMapping(value = {"/hello", "${agens.config.base_path}"})
    public Map<String,String> hello() {
        Map<String,String> map = new HashMap<>();
        map.put("status", "OK");
        map.put("message", "Hello world");
        return map;
    }

    //require authorization
    @GetMapping(value = {"${agens.config.base_path}/user"})
    public ResponseEntity<?> user(HttpServletRequest request) {
    	
        String authToken = request.getHeader(this.tokenHeader);
        String username = jwtTokenUtil.getUsernameFromToken(authToken);
//        UserDetails userDetails = this.userService.loadUserByUsername(username);
        User user = (User) this.userService.loadUserByUsername(username);
        
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("status", "OK");
        map.put("message", "Hello "+user.getFirstname());
        map.put("username", user.getLastname());
        map.put("email", user.getEmail());
        Set<String> authorities = new HashSet<String>();
        for(GrantedAuthority auth: user.getAuthorities()){
        	authorities.add(auth.getAuthority());
        }
        map.put("authorities", authorities);
        
        return ResponseEntity.ok(map);
    }

    //require authorization Admin Role
    @GetMapping(value = {"${agens.config.base_path}/admin"})
    public ResponseEntity<?> admin(HttpServletRequest request) {

    	String authToken = request.getHeader(this.tokenHeader);
        String username = jwtTokenUtil.getUsernameFromToken(authToken);

        User user = (User) this.userService.loadUserByUsername(username);
        
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("status", "OK");
        map.put("message", "Hello "+user.getFirstname());
        map.put("username", user.getLastname());
        map.put("email", user.getEmail());
        Set<String> authorities = new HashSet<String>();
        for(GrantedAuthority auth: user.getAuthorities()){
        	authorities.add(auth.getAuthority());
        }
        map.put("authorities", authorities);
        
        return ResponseEntity.ok(map);
    }    
    
}