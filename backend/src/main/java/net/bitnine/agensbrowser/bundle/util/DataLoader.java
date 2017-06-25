package net.bitnine.agensbrowser.bundle.util;

import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import net.bitnine.agensbrowser.bundle.model.auth.Authority;
import net.bitnine.agensbrowser.bundle.model.auth.IPWhitelist;
import net.bitnine.agensbrowser.bundle.model.auth.User;
import net.bitnine.agensbrowser.bundle.service.auth.UserService;


@Component
public class DataLoader implements ApplicationListener<ContextRefreshedEvent> {

    private final Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private UserService userService;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent e) {
        log.info("Starting data loading...!");
        
        Authority roleAdmin = new Authority("ROLE_ADMIN");
        Authority roleUser = new Authority("ROLE_USER");

        User adminUser = new User("admin", "adminFirstName", "adminLastName", "admin@mail.com");
        Set<Authority> authorities1 = new HashSet<Authority>();
        authorities1.add(roleAdmin); 
        authorities1.add(roleUser); 
        adminUser.setAuthorities(authorities1);
//        adminUser.setAuthority(roleUser);
//        adminUser.setAuthority(roleAdmin);

        User dbAdmin = new User("agraph", "agraphFirstName", "agraphLastName", "agraph@mail.com");
        Set<Authority> authorities2 = new HashSet<Authority>();
        authorities2.add(roleAdmin); 
        authorities2.add(roleUser); 
        dbAdmin.setAuthorities(authorities2);
        
        User testUser = new User("test", "testFirstName", "testLastName", "test@mail.com");
        testUser.setAuthority(roleUser);

        User userUser = new User("user", "userFirstName", "userLastName", "user@mail.com");
        userUser.setAuthority(roleUser);

        // 하나 이상 등록하면 IPBlock이 발생 : 문제가 있음!! 
        IPWhitelist ipw = new IPWhitelist();
        ipw.setIpAddr("127.0.0.1");
        // ipw.setIpAddr("0.0.0.0");

        try {
//            userService.addAuthority(roleAdmin);
//            userService.addAuthority(roleUser);
//            userService.addUser(adminUser);
//            userService.addUser(dbAdmin);
//            userService.addUser(testUser);
//            userService.addUser(userUser);
//            userService.addIpWhiteList(ipw);
        } catch (Exception ex) {
            Logger.getLogger(DataLoader.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

}