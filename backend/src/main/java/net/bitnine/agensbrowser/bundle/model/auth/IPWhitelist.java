package net.bitnine.agensbrowser.bundle.model.auth;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity(name = "AGENS_IP_WHITELIST")
@SequenceGenerator(name="AGENS_BASE_SEQUENCE", sequenceName="AGENS_BASE_SEQUENCE", allocationSize=1)
public class IPWhitelist implements Serializable {
    
	private static final long serialVersionUID = 6946325134131567206L;
	
	@Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="AGENS_BASE_SEQUENCE")
    private Long id;
    private String ipAddr;
    private String description;

    @JsonIgnore				// JSON 출력시 제외됨
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIpAddr() {
        return ipAddr;
    }

    public void setIpAddr(String ipAddr) {
        this.ipAddr = ipAddr;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "IPWhitelist{" + "id=" + id + ", ipAddr=" + ipAddr + ", description=" + description + '}';
    }
    
}