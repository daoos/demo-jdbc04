package net.bitnine.agensbrowser.bundle.service;

import java.util.List;

import net.bitnine.agensbrowser.bundle.exception.InvalidInputException;
import net.bitnine.agensbrowser.bundle.model.AgensProject;

public interface AgensProjectsService {

	AgensProject saveProject(AgensProject proj) throws InvalidInputException;
	void removeProject(Long projId);
	
	AgensProject loadProject(Long projId) throws InvalidInputException;
	List<AgensProject> loadAllProjects(String username) throws InvalidInputException;

}
