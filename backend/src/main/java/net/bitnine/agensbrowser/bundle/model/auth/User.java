package net.bitnine.agensbrowser.bundle.model.auth;

import java.util.Collection;
import java.util.Date;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Temporal;
import javax.persistence.Transient;


@Entity(name = "AGENS_USER")
@SequenceGenerator(name="AGENS_BASE_SEQUENCE", sequenceName="AGENS_BASE_SEQUENCE", allocationSize=1)
public class User implements UserDetails {

	private static final long serialVersionUID = 4185336347334582803L;

	@Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="AGENS_BASE_SEQUENCE")
    private Long id;
    private String username;
    private String firstname;
    private String lastname;
    private String password;
    private String email;
    private boolean enabled = true;

    @JsonInclude
    @Transient
    private boolean active = false;
    
    public User() {
    }

    public User(String username, String firstname, String lastname, String email) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
    }

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Authority> authorities;

    @Temporal(javax.persistence.TemporalType.DATE)
    private Date lastPasswordResetDate;

    @JsonIgnore				// JSON 출력시 제외됨
    public Long getId() {
        return id;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public String getEmail() {
        return email;
    }

    @JsonIgnore				// JSON 출력시 제외됨
    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public boolean isActive() {
        return active;
    }
    public void setActive(boolean state) {
        this.active = state;
    }    
    
    @JsonIgnore
    public Date getLastPasswordResetDate() {
        return lastPasswordResetDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAuthorities(Set<Authority> authorities) {
        this.authorities = authorities;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setLastPasswordResetDate(Date lastPasswordResetDate) {
        this.lastPasswordResetDate = lastPasswordResetDate;
    }
    
    public void setAuthority(Authority authority){
        Set<Authority> as = new HashSet<>();
        as.add(authority);
        this.authorities = as;
    }

    @Override
    public String toString() {
        return "User{" + "id=" + id + ", username=" + username + ", firstname=" + firstname + ", lastname=" + lastname
        		+ ", password=" + password + ", email=" + email + ", authorities=" + authorities + ", enabled=" + enabled 
        		+ ", lastPasswordResetDate=" + lastPasswordResetDate + ", active=" + active + '}';
    }
    
}