package net.bitnine.agensbrowser.bundle.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import net.bitnine.agensbrowser.bundle.model.auth.IPWhitelist;


public interface IPWhitelistRepository extends JpaRepository<IPWhitelist, Long>{

	IPWhitelist findByIpAddr(String ip);
	
}