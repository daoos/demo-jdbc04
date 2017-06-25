package net.bitnine.agensbrowser.bundle.model;

import java.io.Serializable;

public class AdminLockId implements Serializable {

	private static final long serialVersionUID = 4705722810494019536L;
	
	private Integer waiting_pid;
	private Integer other_pid;
	
	public AdminLockId() {
		super();
		// TODO Auto-generated constructor stub
	}	
	public AdminLockId(Integer waiting_pid, Integer other_pid) {
		super();
		this.waiting_pid = waiting_pid;
		this.other_pid = other_pid;
	}

	public Integer getWaiting_pid() {
		return waiting_pid;
	}
	public void setWaiting_pid(Integer waiting_pid) {
		this.waiting_pid = waiting_pid;
	}
	public Integer getOther_pid() {
		return other_pid;
	}
	public void setOther_pid(Integer other_pid) {
		this.other_pid = other_pid;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		AdminLockId other = (AdminLockId) obj;
		if (waiting_pid == null) {
			if (other.waiting_pid != null)
				return false;
		} else if (!waiting_pid.equals(other.waiting_pid))
			return false;
		if (other_pid != other.other_pid)
			return false;
		return true;
	}	
}
