package net.bitnine.agensbrowser.bundle.repository;

import java.util.List;

import net.bitnine.agensbrowser.bundle.model.AdminLock;

public interface AdminLocksDAO {

	public List<AdminLock> getAllLocks();
	
}
