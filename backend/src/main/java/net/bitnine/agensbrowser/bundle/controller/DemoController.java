package net.bitnine.agensbrowser.bundle.controller;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mobile.device.Device;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.bitnine.agensbrowser.bundle.exception.InvalidInputException;
import net.bitnine.agensbrowser.bundle.model.AgensProject;
import net.bitnine.agensbrowser.bundle.model.ConnectRequest;
import net.bitnine.agensbrowser.bundle.model.LabelMetaRequest;
import net.bitnine.agensbrowser.bundle.model.QueryRequest;
import net.bitnine.agensbrowser.bundle.model.ResultResponse;
import net.bitnine.agensbrowser.bundle.model.auth.User;
import net.bitnine.agensbrowser.bundle.model.meta.AgensDatabase;
import net.bitnine.agensbrowser.bundle.model.meta.AgensProperty;
import net.bitnine.agensbrowser.bundle.service.AgensMetaService;
import net.bitnine.agensbrowser.bundle.service.AgensProjectsService;
import net.bitnine.agensbrowser.bundle.service.auth.UserService;
import net.bitnine.agensbrowser.bundle.util.TokenUtil;


@RestController
@RequestMapping(value = "${agens.config.base_path}/demo")
public class DemoController {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final AtomicLong taskSeq = new AtomicLong();
    
    protected static final String DEFAULT_HELLO_NAME = "World";

    @Value("${jwt.header}")
    private String tokenHeader;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;
    
    @Autowired
    private AgensProjectsService projectService;
    
	@Autowired
	AgensMetaService metaService;	
	
	@Value("${agens.config.base_path}/demo")
	private String basePath;
	
	@RequestMapping(value = "", method = RequestMethod.GET
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> sayDemo(
            @RequestParam(value = "name", required = true, defaultValue = DEFAULT_HELLO_NAME) String name
            , HttpServletRequest request, HttpServletResponse response, Device device)
	{		
		logger.info("DemoController: sayHello()");

		Map<String,String> msg = new HashMap<String,String>();
		msg.put( "message", String.format("hello %s(%d)",name,taskSeq.incrementAndGet()) );
		msg.put( "token", getNewToken(device, "test", "test") );
		
		return new ResponseEntity<Map<String,String>>(msg, HttpStatus.OK);
	}

	private String getNewToken(Device device, String user_id, String user_pw){
//      userService.isIPOK();

      // Perform the security
      final Authentication authentication = authenticationManager.authenticate(
    		  new UsernamePasswordAuthenticationToken(user_id, user_pw)
      );

      SecurityContextHolder.getContext().setAuthentication(authentication);

      // Reload password post-security so we can generate token
      final UserDetails userDetails = userService.loadUserByUsername(user_pw);

      return jwtTokenUtil.generateToken(userDetails, device);		
	}
	
	/*
	 *	http://127.0.0.1:8080/api/v1/demo/connect 
	    { 
			"host"   : "27.117.163.21", 
			"port"   : "15602",
			"db"     : "test_ts",
			"user_id": "agraph",
			"user_pw": "agraph"
		}
	 * 
	 */
	@RequestMapping(value = "connect", method = RequestMethod.POST
            , consumes = {"application/json", "application/xml"}
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> apiConnect(
            @RequestBody ConnectRequest param
            , HttpServletRequest request, HttpServletResponse response, Device device)
	{
		logger.info( String.format("%s <== %s", basePath+"/connect", param.toString() ));
//		String token = getNewToken(device, param.user_id, param.user_pw);

		// Perform the security
		final Authentication authentication = authenticationManager.authenticate(
		  new UsernamePasswordAuthenticationToken(param.user_id, param.user_pw)
		);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		// Reload password post-security so we can generate token
		final User user = (User) userService.loadUserByUsername(param.user_id);
		String token = jwtTokenUtil.generateToken(user, device);		
		
		param.setSessionId( token );
		metaService.addConnection(param);
		
		Map<String,Object> result = new HashMap<String,Object>();
		result.put("message", (Object)"Connect is successful");
		result.put("queryUrl", basePath+"/connect");
		result.put("token", token);
		// login user info.
		result.put("username", user.getUsername());
		result.put("email", user.getEmail());
        Set<String> authorities = new HashSet<String>();
        for(GrantedAuthority auth: user.getAuthorities()){
        	authorities.add(auth.getAuthority());
        }
        result.put("authorities", authorities);
		
		return new ResponseEntity<Map<String,Object>>(result, HttpStatus.OK);
	}

	/*
	 *	http://localhost:8080/api/v1/demo/disconnect
	 * 
	 */
	@RequestMapping(value = "disconnect", method = RequestMethod.GET)
    public ResponseEntity<?> apiDisconnect(
            HttpServletRequest request, HttpServletResponse response, Device device)
	{
		String token = request.getHeader(tokenHeader);
		logger.info(String.format("%s <== %s", basePath+"/disconnect", token));
		
		boolean isNormal = metaService.removeConnection( token );
		
		Map<String,String> result = new HashMap<String,String>();
		result.put("status", String.valueOf(isNormal));
		result.put("message", "disconnection to database is done whether status is true/false");
		result.put("queryUrl", basePath+"/disconnect");

		return new ResponseEntity<Map<String,String>>(result, HttpStatus.OK);
	}

	/*
	 *	http://localhost:8080/api/v1/demo/disconnect
	 * 
	 */
	@RequestMapping(value = "is_login", method = RequestMethod.GET)
    public ResponseEntity<?> apiIsLogin(
            HttpServletRequest request, HttpServletResponse response, Device device)
	{
		String token = request.getHeader(tokenHeader);
		logger.info(String.format("%s <== %s", basePath+"/is_login", token));
		
		boolean isLogin = metaService.isAlive( token );
		
		Map<String,String> result = new HashMap<String,String>();
		result.put("status", String.valueOf(isLogin));
		result.put("message", "whether connection is alive or not");
		result.put("queryUrl", basePath+"/is_login");

		return new ResponseEntity<Map<String,String>>(result, HttpStatus.OK);
	}
	
	/*
	 *	http://localhost:8080/api/v1/demo/db 
	    { 
			AgensDatabase
			  -> List<AgensGraph>
			  	-> Vertexes: List<AgensLabel>
			  	-> Edges   : List<AgensLabel>
		}
	 * 
	 */
	@RequestMapping(value = "db", method = RequestMethod.GET)
    public ResponseEntity<?> apiDb(
            HttpServletRequest request, HttpServletResponse response, Device device)
	{
		String token = request.getHeader(tokenHeader);
		logger.info(String.format("%s", basePath+"/db"));
		
		AgensDatabase meta = metaService.getMetaBySessionId( token );		
		if( meta == null ){
			Map<String,String> result = new HashMap<String,String>();
			result.put("message", "ERROR: cannot find Meta-data about your AgensDatabase");
			result.put("queryUrl", basePath+"/db");

			return new ResponseEntity<Map<String,String>>(result, HttpStatus.OK);
		}
		
		return new ResponseEntity<AgensDatabase>(meta, HttpStatus.OK);
	}

	/*
	 *	http://localhost:8080/api/v1/demo/label
	    { 
			"graph" : "imdb_graph",
			"type" : "vertex",
			"name" : "production"
		}
	 * 
	 */
	@RequestMapping(value = "label", method = RequestMethod.POST
            , consumes = {"application/json", "application/xml"}
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> apiLabel(
            @RequestBody LabelMetaRequest param
            , HttpServletRequest request, HttpServletResponse response, Device device)
	{
		String token = request.getHeader(tokenHeader);
		logger.info(String.format("%s <== %s", basePath+"/label", param.toString()));
		
		param.setSessionId( token );
		param.setRequestId( taskSeq.incrementAndGet() );
		
		// 결과 데이터 작성
		List<AgensProperty> properties = metaService.getLabelProperties(param);
		return new ResponseEntity<List<AgensProperty>>(properties, HttpStatus.OK);
	}	

	/*
	 *	http://localhost:8080/api/v1/demo/label_count 
	    { 
			"graph" : "imdb_graph",
			"type" : "vertex",
			"name" : "company"
		}
	 * 
	 */
	@RequestMapping(value = "label_count", method = RequestMethod.POST
            , consumes = {"application/json", "application/xml"}
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> apiLabelCount(
            @RequestBody LabelMetaRequest param
            , HttpServletRequest request, HttpServletResponse response, Device device)
	{
		String token = request.getHeader(tokenHeader);
		logger.info(String.format("%s <== %s", basePath+"/label_count", param.toString()));
		
		param.setSessionId( token );
		param.setRequestId( taskSeq.incrementAndGet() );
		
		// 결과 데이터 작성
		Long count = metaService.getLabelCount(param);
		return new ResponseEntity<Long>(count, HttpStatus.OK);
	}	
	
	/*
	 *	http://localhost:8080/api/v1/demo/query 
	    { 
			"sql" : "match (a:production {'kind': 'episode'}) return a limit 20" 
		}
	 * 
	 */
	@RequestMapping(value = "query", method = RequestMethod.POST
            , consumes = {"application/json", "application/xml"}
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> apiQuery(
            @RequestBody QueryRequest param
            , HttpServletRequest request, HttpServletResponse response, Device device)
	{
		String token = request.getHeader(tokenHeader);
		logger.info(String.format("%s <== %s", basePath+"/query", param.toString()));
		
		param.setSessionId( token );
		param.setRequestId( taskSeq.incrementAndGet() );
		
		// 결과 데이터 작성
		ResultResponse result = new ResultResponse( param );
		metaService.query(result);
		
		result.setMessage("Request is done");
		result.setFinishTime(new Timestamp(System.currentTimeMillis()));
		return new ResponseEntity<ResultResponse>(result, HttpStatus.OK);
	}	

	////////////////////////////////////////////////////////////
	
	/*
	 *	http://localhost:8080/api/v1/demo/projects 
	    { 
			"username" : "agraph" 
		}
	 * 
	 */
	@RequestMapping(value = "projects", method = RequestMethod.POST
            , consumes = {"application/json", "application/xml"}
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> apiProjects(
            @RequestBody Map<String,String> param
            , HttpServletRequest request, HttpServletResponse response, Device device)
	{
		String username = param.get("username");
		if( username == null ){
			return ResponseEntity.badRequest().body(null);
		}		
		logger.info(String.format("%s <== %s", basePath+"/projects", username));
		
		List<AgensProject> result;
		try {
			result = projectService.loadAllProjects(username);
		} catch (InvalidInputException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		return new ResponseEntity<List<AgensProject>>(result, HttpStatus.OK);
	}	

	/*
	 *	http://localhost:8080/api/v1/demo/project/save 
	    { 
			"username" : "agraph",
			"title" : "Sample Project#01" 
		}
	 * 
	 */
	@RequestMapping(value = "project/save", method = RequestMethod.POST
            , consumes = {"application/json", "application/xml"}
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> apiProjectSave(
            @RequestBody AgensProject param
            , HttpServletRequest request, HttpServletResponse response, Device device)
	{
		logger.info(String.format("%s <== %s", basePath+"/project/save", param.getUsername()));
		String username = param.getUsername();
		String title = param.getTitle();
		if( username == null || title == null ){
			return ResponseEntity.badRequest().body(null);
		}
		
		AgensProject result;
		try {
			result = projectService.saveProject(param);
		} catch (InvalidInputException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		return new ResponseEntity<AgensProject>(result, HttpStatus.OK);
	}

	/*
	 *	http://localhost:8080/api/v1/demo/project/data 
	    { 
			"id" : 1001 
		}
	 * 
	 */
	@RequestMapping(value = "project/data", method = RequestMethod.GET
            , consumes = {"application/json", "application/xml"}
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> apiProjectData(
    		@RequestParam("id") Long id
            , HttpServletRequest request, HttpServletResponse response, Device device)
	{
		if( id == null ){
			return ResponseEntity.badRequest().body(null);
		}		
		logger.info(String.format("%s <== ID[%d]", basePath+"/project/data", id));
		
		AgensProject result;
		try {
			result = projectService.loadProject(id);
		} catch (InvalidInputException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		if( result == null ){
			return ResponseEntity.badRequest().body(null);
		}
		return new ResponseEntity<Object>(result.getGraph(), HttpStatus.OK);
	}

	/*
	 *	http://localhost:8080/api/v1/demo/project/remove 
	    { 
			"id" : 1001 
		}
	 * 
	 */
	@RequestMapping(value = "project/remove", method = RequestMethod.GET
            , consumes = {"application/json", "application/xml"}
            , produces = {"application/json", "application/xml"})
    public ResponseEntity<?> apiProjectRemove(
    		@RequestParam("id") Long id
            , HttpServletRequest request, HttpServletResponse response, Device device)
	{
		if( id == null ){
			return ResponseEntity.badRequest().body(null);
		}		
		logger.info(String.format("%s <== ID[%d]", basePath+"/project/remove", id));

		projectService.removeProject(id);
		return new ResponseEntity<Long>(id, HttpStatus.OK);
	}
}
