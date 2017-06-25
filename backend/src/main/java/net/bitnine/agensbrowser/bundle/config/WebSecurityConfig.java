package net.bitnine.agensbrowser.bundle.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@SuppressWarnings("SpringJavaAutowiringInspection")
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AuthenticationEntryPointImpl unauthorizedHandler;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    public void configureAuthentication(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder
                .userDetailsService(this.userDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder
    passwordEncoder() {
//        return new BCryptPasswordEncoder();			
        return NoOpPasswordEncoder.getInstance();		// 패스워드 암호화 하지 않음 (개발용)
    }

    @Bean
    public AuthenticationTokenFilter authenticationTokenFilterBean() throws Exception {
        return new AuthenticationTokenFilter();
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
    	httpSecurity.authorizeRequests()                
		    	// allow anonymous resource requests
		        .antMatchers(HttpMethod.GET,
		                "/", "/index.html", "/favicon.ico",
		                "/**/*.otf", "/**/*.eot", "/**/*.ttf", "/**/*.woff", "/**/*.woff2",
		                "/**/*.json", "/**/*.csv", "/**/*.tsv",
		                "/**/*.ico", "/**/*.png", "/**/*.svg",
		                "/**/*.css", "/**/*.js"
		        ).permitAll();

        httpSecurity
                // we don't need CSRF because our token is invulnerable
                .csrf().disable()
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
                // don't create session
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests()
                .antMatchers("/api/v1/").permitAll()
                .antMatchers("/api/v1/demo/connect").permitAll()
                .antMatchers("/api/v1/demo/disconnect").permitAll()
                .antMatchers("/api/v1/demo/is_login").permitAll()
                .antMatchers("/api/v1/demo/**").hasRole("USER")
                .antMatchers("/api/v1/auth/**").hasRole("ADMIN")
                .antMatchers("/api/v1/admin").hasRole("ADMIN")
                .anyRequest().authenticated();

        // Custom JWT based security filter
        httpSecurity
                .addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class);

        // disable page caching
        httpSecurity.headers().cacheControl();
    }
}