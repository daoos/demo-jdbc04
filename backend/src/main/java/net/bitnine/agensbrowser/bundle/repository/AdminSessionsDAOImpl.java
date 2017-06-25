package net.bitnine.agensbrowser.bundle.repository;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import net.bitnine.agensbrowser.bundle.model.AdminSession;

@Repository
@Transactional
public class AdminSessionsDAOImpl implements AdminSessionsDAO {

    @PersistenceContext
    private EntityManager manager;
    
	@Override
	public List<AdminSession> getAllSessions() {
		List<AdminSession> sessions = manager.createNamedQuery("getAllSessions", AdminSession.class)
											.getResultList();
		return sessions;
	}

	@Override
	public List<AdminSession> getAllSessionsByPid(Integer pid) {
		List<AdminSession> sessions = manager.createNamedQuery("getAllSessionsByPid", AdminSession.class)
											.setParameter(1, pid)
											.getResultList();
		return sessions;
	}

}
