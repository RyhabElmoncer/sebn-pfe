package com.sebn.formation.service;
import com.sebn.formation.dto.*;
import com.sebn.formation.entity.*;
import com.sebn.formation.repository.*;
import com.sebn.formation.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class AuthService {
    @Autowired private UserRepository userRepo;
    @Autowired private RoleRepository roleRepo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private AuthenticationManager authManager;
    @Autowired private UserDetailsService uds;
    @Autowired private JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(),req.getPassword()));
        UserDetails ud = uds.loadUserByUsername(req.getEmail());
        String token = jwtUtil.generateToken(ud);
        User u = userRepo.findByEmail(req.getEmail()).orElseThrow();
        return new AuthResponse(token,u.getEmail(),u.getUsername(), u.getRole()!=null?u.getRole().getName():"",u.getId());
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) throw new RuntimeException("Email déjà utilisé");
        Role role = req.getRoleId()!=null
                ? roleRepo.findById(req.getRoleId()).orElseThrow(()->new RuntimeException("Rôle non trouvé"))
                : roleRepo.findByName("EMPLOYE").orElse(null);
        User u = userRepo.save(User.builder().username(req.getUsername()).email(req.getEmail())
                .password(encoder.encode(req.getPassword())).role(role).active(true).build());
        UserDetails ud = uds.loadUserByUsername(u.getEmail());
        return new AuthResponse(jwtUtil.generateToken(ud),u.getEmail(),u.getUsername(), role!=null?role.getName():"",u.getId());
    }
}
