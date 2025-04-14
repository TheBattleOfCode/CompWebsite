package com.comp.web.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserDetailsService extends org.springframework.security.core.userdetails.UserDetailsService {
    
    /**
     * Load a user by username
     * 
     * @param username the username to search for
     * @return the UserDetails object
     * @throws UsernameNotFoundException if the user is not found
     */
    @Override
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
