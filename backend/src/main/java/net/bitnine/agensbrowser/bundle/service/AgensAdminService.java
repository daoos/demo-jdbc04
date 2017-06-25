package net.bitnine.agensbrowser.bundle.service;

import java.util.List;

import net.bitnine.agensbrowser.bundle.model.AdminLock;
import net.bitnine.agensbrowser.bundle.model.AdminSession;

public interface AgensAdminService {

	List<AdminSession> getSessions();
	List<AdminSession> getSessions(Integer pid);

	List<AdminLock> getLocks();
	
}
