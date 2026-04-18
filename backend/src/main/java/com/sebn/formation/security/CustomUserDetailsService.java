package com.sebn.formation.security;
import com.sebn.formation.entity.User;
import com.sebn.formation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired private UserRepository repo;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Non trouvé: "+email));
        String role = u.getRole()!=null ? "ROLE_"+u.getRole().getName() : "ROLE_EMPLOYE";
        return new org.springframework.security.core.userdetails.User(
                u.getEmail(), u.getPassword(), Collections.singletonList(new SimpleGrantedAuthority(role)));
    }
}
