package net.bitnine.agensbrowser.bundle.model.auth;

import javax.persistence.*;
import org.springframework.security.core.GrantedAuthority;


@Entity(name = "AGENS_AUTHORITY")
@SequenceGenerator(name="AGENS_BASE_SEQUENCE", sequenceName="AGENS_BASE_SEQUENCE", allocationSize=1)
public class Authority  implements GrantedAuthority {

	private static final long serialVersionUID = 44441384198750136L;
	
	@Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="AGENS_BASE_SEQUENCE")
    private Long id;
    private String name;

    public Authority() {
    }

    public Authority(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getAuthority() {
        return name;
    }
    
}