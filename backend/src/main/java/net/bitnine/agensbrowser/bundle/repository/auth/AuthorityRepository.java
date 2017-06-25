package net.bitnine.agensbrowser.bundle.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import net.bitnine.agensbrowser.bundle.model.auth.Authority;


public interface AuthorityRepository extends JpaRepository<Authority, Long>{
    Authority findByName(String name);
}