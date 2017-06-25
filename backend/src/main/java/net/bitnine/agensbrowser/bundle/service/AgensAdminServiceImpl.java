package net.bitnine.agensbrowser.bundle.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.bitnine.agensbrowser.bundle.model.AdminLock;
import net.bitnine.agensbrowser.bundle.model.AdminSession;
import net.bitnine.agensbrowser.bundle.repository.AdminLocksDAO;
import net.bitnine.agensbrowser.bundle.repository.AdminSessionsDAO;


@Service
public class AgensAdminServiceImpl implements AgensAdminService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private AdminSessionsDAO sessionsRepository;
	@Autowired
	private AdminLocksDAO locksRepository;
	
	@Override
	public List<AdminSession> getSessions() {
		return sessionsRepository.getAllSessions();
	}

	@Override
	public List<AdminSession> getSessions(Integer pid) {
		return sessionsRepository.getAllSessionsByPid(pid);
	}

	@Override
	public List<AdminLock> getLocks() {
		return locksRepository.getAllLocks();
	}

}
