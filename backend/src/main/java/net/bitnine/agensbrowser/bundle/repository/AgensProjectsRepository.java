package net.bitnine.agensbrowser.bundle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import net.bitnine.agensbrowser.bundle.model.AgensProject;

public interface AgensProjectsRepository extends JpaRepository<AgensProject, Long> {

	List<AgensProject> findByUsernameOrderByIdDesc(String username);
	AgensProject findById(Long projId);

}
