package net.bitnine.agensbrowser.bundle.repository;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import net.bitnine.agensbrowser.bundle.model.AdminLock;


@Repository
@Transactional
public class AdminLocksDAOImpl implements AdminLocksDAO {

    @PersistenceContext
    private EntityManager manager;
	
	@Override
	public List<AdminLock> getAllLocks() {
		List<AdminLock> locks = manager.createNamedQuery("getAllLocks", AdminLock.class)
				.getResultList();
		return locks;
	}

}
