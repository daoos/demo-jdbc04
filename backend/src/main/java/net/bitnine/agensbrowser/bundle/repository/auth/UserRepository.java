package net.bitnine.agensbrowser.bundle.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import net.bitnine.agensbrowser.bundle.model.auth.User;


public interface UserRepository extends JpaRepository<User, Long>{

	User findByUsername(String username);
	
}