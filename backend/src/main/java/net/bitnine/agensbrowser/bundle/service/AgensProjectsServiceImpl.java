package net.bitnine.agensbrowser.bundle.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.bitnine.agensbrowser.bundle.exception.InvalidInputException;
import net.bitnine.agensbrowser.bundle.model.AgensProject;
import net.bitnine.agensbrowser.bundle.repository.AgensProjectsRepository;

@Service
public class AgensProjectsServiceImpl implements AgensProjectsService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

//    @Autowired
//    private UserRepository userRepository;

    @Autowired
    private AgensProjectsRepository projectRepository;
    
    @Override
	public AgensProject saveProject(AgensProject proj) throws InvalidInputException {
    	logger.info("saveProject(): "+proj.toString());
    	
    	proj.setUsername( proj.getUsername().toLowerCase() );    	
		return projectRepository.save(proj);		// .saveAndFlush(proj);
	}

    @Override
	public void removeProject(Long projId) {
    	logger.info("removeProject(): projectId="+projId);
    	
		projectRepository.delete(projId);
	}
    
    @Override
	public AgensProject loadProject(Long projId) throws InvalidInputException {
    	logger.info("loadProject(): projectId="+projId);
    	
		AgensProject proj = projectRepository.findById(projId);
		if( proj == null ){
			throw new InvalidInputException("Invalid project ID");
		}
    	return proj;
	}

    @Override
	public List<AgensProject> loadAllProjects(String username) throws InvalidInputException {
    	logger.info("loadAllProjects(): username="+username);
    	
    	List<AgensProject> list = projectRepository.findByUsernameOrderByIdDesc(username);
		if( list == null ){
			throw new InvalidInputException("Invalid username for finding projects");
		}
		return list;
	}
    
}
