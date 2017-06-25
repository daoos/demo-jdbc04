package net.bitnine.agensbrowser.bundle.model;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.EntityResult;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.FieldResult;
import javax.persistence.Id;
import javax.persistence.NamedNativeQuery;
import javax.persistence.NamedNativeQueries;


@Entity(name="AdminSession")
@SqlResultSetMapping(
    name="agensSessionsMapping",
    entities=@EntityResult(
		entityClass=AdminSession.class,
        fields={
            @FieldResult(name="pid", column="PID"),
            @FieldResult(name="datname", column="DATNAME"),
            @FieldResult(name="usename", column="USENAME"),
            @FieldResult(name="appname", column="APPLICATION_NAME"),
            @FieldResult(name="clientip", column="CLIENT_ADDR"),
            @FieldResult(name="query", column="QUERY"),
            @FieldResult(name="state", column="STATE"),
            @FieldResult(name="query_start", column="QUERY_START")
        }
    )
)
@NamedNativeQueries({
	@NamedNativeQuery(name="getAllSessions"
		, query="SELECT pid, datname, usename, application_name, client_addr, query, state, query_start"
				+" FROM pg_stat_activity"
				+" order by query_start desc"
		, resultSetMapping="agensSessionsMapping"
//		, resultClass=AdminSession.class
	),
	@NamedNativeQuery(name="getAllSessionsByPid"
		, query="SELECT pid, datname, usename, application_name, client_addr, query, state, query_start"
				+" FROM pg_stat_activity"
				+" WHERE pid = ?"
		, resultSetMapping="agensSessionsMapping"
//		, resultClass=AdminSession.class
	)
})	
public class AdminSession implements Serializable {

	private static final long serialVersionUID = -5134701819804379304L;
	
	@Id
	@GeneratedValue
	private Integer pid;
	
	private String datname;
	private String usename;
	private String appname;
	private String clientip;
	private String query;
	private String state;
	private Timestamp query_start;
		
	public AdminSession() {
		super();
	}

	public AdminSession(Integer pid, String datname, String usename, String appname, String clientip, String query,
			String state, Timestamp query_start) {
		super();
		this.pid = pid;
		this.datname = datname;
		this.usename = usename;
		this.appname = appname;
		this.clientip = clientip;
		this.query = query;
		this.state = state;
		this.query_start = query_start;
	}

	public Integer getPid() {
		return pid;
	}

	public void setPid(Integer pid) {
		this.pid = pid;
	}

	public String getDatname() {
		return datname;
	}

	public void setDatname(String datname) {
		this.datname = datname;
	}

	public String getUsename() {
		return usename;
	}

	public void setUsename(String usename) {
		this.usename = usename;
	}

	public String getAppname() {
		return appname;
	}

	public void setAppname(String appname) {
		this.appname = appname;
	}

	public String getClientip() {
		return clientip;
	}

	public void setClientip(String clientip) {
		this.clientip = clientip;
	}

	public String getQuery() {
		return query;
	}

	public void setQuery(String query) {
		this.query = query;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public Timestamp getQuery_start() {
		return query_start;
	}

	public void setQuery_start(Timestamp query_start) {
		this.query_start = query_start;
	}

	@Override
	public String toString() {
		return "AgensAdminSession [pid=" + pid + ", datname=" + datname + ", usename=" + usename + ", appname="
				+ appname + ", clientip=" + clientip + ", query=" + query + ", state=" + state + "]";
	}

}
