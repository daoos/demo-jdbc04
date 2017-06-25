package net.bitnine.agensbrowser.bundle.model.auth;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

public class RegisterUserRequest implements Serializable {

	private static final long serialVersionUID = 3959258233837063925L;
	
	private String username;
    private String firstname;
    private String lastname;
    private String password;
    private String email;
    private String roles;
    
	public RegisterUserRequest() {
		super();
	}
	
	public RegisterUserRequest(String username, String firstname, String lastname, String password, String email, String roles) {
		super();
		this.username = username;
		this.firstname = firstname;
		this.lastname = lastname;
		this.password = password;
		this.email = email;
		this.roles = roles;
	}
	
	public List<String> getRoleList(){
		return (List<String>) Arrays.asList( this.roles.split(",") );
	}
	
	public String getRoles() {
		return roles;
	}
	public void setRoles(String roles) {
		this.roles = roles;
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	@Override
	public String toString() {
		return "RegisterUserRequest [username=" + username + ", firstname=" + firstname + ", lastname=" + lastname
				+ ", password=" + password + ", email=" + email + ", roles=" + roles+ "]";
	}
    
}
