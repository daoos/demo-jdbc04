package net.bitnine.agensbrowser.bundle.model;

//import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.EntityResult;
import javax.persistence.FieldResult;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.NamedNativeQueries;
import javax.persistence.NamedNativeQuery;
import javax.persistence.SqlResultSetMapping;

@Entity(name="AdminLock")
@IdClass(AdminLockId.class)
@SqlResultSetMapping(
    name="agensLocksMapping",
    entities=@EntityResult(
		entityClass=AdminLock.class,
        fields={
            @FieldResult(name="waiting_locktype", column="waiting_locktype"),
//            @FieldResult(name="waiting_table", column="waiting_table"),
            @FieldResult(name="waiting_query", column="waiting_query"),
            @FieldResult(name="waiting_mode", column="waiting_mode"),
            @FieldResult(name="waiting_pid", column="waiting_pid"),
            @FieldResult(name="other_locktype", column="other_locktype"),
//            @FieldResult(name="other_table", column="other_table"),
            @FieldResult(name="other_query", column="other_query"),
            @FieldResult(name="other_mode", column="other_mode"),
            @FieldResult(name="other_pid", column="other_pid"),
            @FieldResult(name="other_granted", column="other_granted")
        }
    )
)
@NamedNativeQueries({
	@NamedNativeQuery(name="getAllLocks"
		, query="SELECT" 
				+"     waiting.locktype           AS waiting_locktype,"
//				+"     waiting.relation::regclass AS waiting_table,"		// **NOTE: parameter로 인식한다! error 발생!!
				+"     waiting_stm.query          AS waiting_query,"
				+"     waiting.mode               AS waiting_mode,"
				+"     waiting.pid                AS waiting_pid,"
				+"     other.locktype             AS other_locktype,"
//				+"     other.relation::regclass   AS other_table,"			// **NOTE: parameter로 인식한다! error 발생!!
				+"     other_stm.query            AS other_query,"
				+"     other.mode                 AS other_mode,"
				+"     other.pid                  AS other_pid,"
				+"     other.GRANTED              AS other_granted"
				+" FROM pg_catalog.pg_locks AS waiting"
				+" JOIN pg_catalog.pg_stat_activity AS waiting_stm ON (waiting_stm.pid = waiting.pid)"
				+" JOIN pg_catalog.pg_locks AS other ON ((waiting.database = other.database AND waiting.relation = other.relation) OR waiting.transactionid = other.transactionid)"
				+" JOIN pg_catalog.pg_stat_activity AS other_stm ON (other_stm.pid = other.pid)"
				+" WHERE NOT waiting.GRANTED AND waiting.pid <> other.pid"
		, resultSetMapping="agensLocksMapping"
//		, resultClass=AdminLock.class
	)
})
public class AdminLock /*implements Serializable*/ {

//	private static final long serialVersionUID = -8191723927383943081L;

	@Id
	private Integer waiting_pid;
	@Id
	private Integer other_pid;
	
	private String waiting_locktype;
	private String waiting_query;
	private String waiting_mode;
	private String other_locktype;
	private String other_query;
	private String other_mode;
	private String other_granted;

//	private String waiting_table;
//	private String other_table;

	public AdminLock() {
		super();
	}
/*
	public AdminLock(String waiting_locktype, String waiting_table, String waiting_query, String waiting_mode,
			Integer waiting_pid, String other_locktype, String other_table, String other_query, String other_mode,
			Integer other_pid, String other_granted) {
		super();
		this.waiting_locktype = waiting_locktype;
		this.waiting_table = waiting_table;
		this.waiting_query = waiting_query;
		this.waiting_mode = waiting_mode;
		this.waiting_pid = waiting_pid;
		this.other_locktype = other_locktype;
		this.other_table = other_table;
		this.other_query = other_query;
		this.other_mode = other_mode;
		this.other_pid = other_pid;
		this.other_granted = other_granted;
	}
*/
	public String getWaiting_locktype() {
		return waiting_locktype;
	}

	public void setWaiting_locktype(String waiting_locktype) {
		this.waiting_locktype = waiting_locktype;
	}
/*
	public String getWaiting_table() {
		return waiting_table;
	}

	public void setWaiting_table(String waiting_table) {
		this.waiting_table = waiting_table;
	}
*/
	public String getWaiting_query() {
		return waiting_query;
	}

	public void setWaiting_query(String waiting_query) {
		this.waiting_query = waiting_query;
	}

	public String getWaiting_mode() {
		return waiting_mode;
	}

	public void setWaiting_mode(String waiting_mode) {
		this.waiting_mode = waiting_mode;
	}

	public Integer getWaiting_pid() {
		return waiting_pid;
	}

	public void setWaiting_pid(Integer waiting_pid) {
		this.waiting_pid = waiting_pid;
	}
	public String getOther_locktype() {
		return other_locktype;
	}

	public void setOther_locktype(String other_locktype) {
		this.other_locktype = other_locktype;
	}
/*
	public String getOther_table() {
		return other_table;
	}

	public void setOther_table(String other_table) {
		this.other_table = other_table;
	}
*/
	public String getOther_query() {
		return other_query;
	}

	public void setOther_query(String other_query) {
		this.other_query = other_query;
	}

	public String getOther_mode() {
		return other_mode;
	}

	public void setOther_mode(String other_mode) {
		this.other_mode = other_mode;
	}

	public Integer getOther_pid() {
		return other_pid;
	}

	public void setOther_pid(Integer other_pid) {
		this.other_pid = other_pid;
	}

	public String getOther_granted() {
		return other_granted;
	}

	public void setOther_granted(String other_granted) {
		this.other_granted = other_granted;
	}

	@Override
	public String toString() {
		return "AdminLock [waiting_locktype=" + waiting_locktype 
//				+ ", waiting_table=" + waiting_table + ", other_table=" + other_table
				+ ", waiting_query=" + waiting_query + ", waiting_mode=" + waiting_mode + ", waiting_pid=" + waiting_pid
				+ ", other_locktype=" + other_locktype + ", other_query=" + other_query
				+ ", other_mode=" + other_mode + ", other_pid=" + other_pid + ", other_granted=" + other_granted 
				+ "]";
	}
	
}
