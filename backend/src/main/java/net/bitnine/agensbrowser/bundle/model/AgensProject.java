package net.bitnine.agensbrowser.bundle.model;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.SequenceGenerator;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity(name = "AGENS_USER_PROJECTS")
@SequenceGenerator(name="AGENS_PROJECTS_SEQUENCE", sequenceName="AGENS_PROJECTS_SEQUENCE", allocationSize=1)
public class AgensProject implements Serializable {

	private static final long serialVersionUID = -164032152394392059L;

	@Id
	// Use the sequence that is defined above:
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="AGENS_PROJECTS_SEQUENCE")
    private Long id = -1L;
	
	@Column(name = "username", nullable = false)
    private String username;

	@Column(name = "title", nullable = false)
	private String title;
    @Column(name = "description")
    private String description;

    /* 참고: 
     * "Audit with JPA: creation and update date"
     * http://blog.octo.com/en/audit-with-jpa-creation-and-update-date/ 
     */

    // **NOTE: Update 할 때, create_dt는 null이 되어버림 
    @Column(name = "create_dt", columnDefinition="TIMESTAMP DEFAULT CURRENT_TIMESTAMP", insertable=true, updatable=false)
    private Timestamp create_dt;
    // @Version
	@Column(name = "update_dt", columnDefinition="TIMESTAMP DEFAULT CURRENT_TIMESTAMP", insertable=false, updatable=true)
    private Timestamp update_dt;
	
	@Column(name = "sql")
    private String sql;
	@Column(name = "image", columnDefinition = "BYTEA", length=10485760)
    private byte[] image;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Column(name = "graph", columnDefinition = "TEXT", length=10485760)
    private String graph;

    public AgensProject(){
    	super();
    }
    public AgensProject(String username, String title, String description, String sql, String graph){
    	super();
    	this.username = username;
    	this.title = title;
    	this.description = description;
    	this.sql = sql;
    	this.graph = graph;
    }

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}

	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}

	public Timestamp getCreate_dt() {
		return create_dt;
	}
	public void setCreate_dt(Timestamp create_dt) {
		this.create_dt = create_dt;
	}

	public Timestamp getUpdate_dt() {
		return update_dt;
	}
	public void setUpdate_dt(Timestamp update_dt) {
		this.update_dt = update_dt;
	}

	@PrePersist
	protected void onCreate() {
		this.create_dt = new Timestamp(System.currentTimeMillis());
		this.update_dt = this.create_dt;
	}
	@PreUpdate
	protected void onUpdate() {
		this.update_dt = new Timestamp(System.currentTimeMillis());
	}
	  
	public String getSql() {
		return sql;
	}
	public void setSql(String sql) {
		this.sql = sql;
	}

	public byte[] getImage() {
		return image;
	}
	public void setImage(byte[] image) {
		this.image = image;
	}
	
	public String getGraph() {
		return graph;
	}
	public void setGraph(String graph) {
		this.graph = graph;
	}

	@Override
	public String toString() {
		return "UserProject [id=" + id + ", username=" + username + ", title=" + title + ", description="
				+ description + ", create_dt=" + create_dt + ", update_dt=" + update_dt + ", sql=" + sql 
				+ ", image.length=" + (image != null ? image.length : 0)
				+ ", graph.length=" + (graph != null ? graph.length() : 0) + "]";
	}
    
}
