package com.sebn.formation.service;
import com.sebn.formation.dto.UserDTO;
import com.sebn.formation.entity.*;
import com.sebn.formation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class UserService {
    @Autowired private UserRepository repo;
    @Autowired private RoleRepository roleRepo;
    @Autowired private PasswordEncoder encoder;

    public List<UserDTO> getAll() { return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList()); }
    public UserDTO getById(Long id) { return toDTO(repo.findById(id).orElseThrow()); }
    public UserDTO create(UserDTO dto) {
        if (repo.existsByEmail(dto.getEmail())) throw new RuntimeException("Email déjà utilisé");
        Role r = dto.getRoleId()!=null ? roleRepo.findById(dto.getRoleId()).orElseThrow() : null;
        return toDTO(repo.save(User.builder().username(dto.getUsername()).email(dto.getEmail())
                .password(encoder.encode(dto.getPassword())).role(r).active(true).build()));
    }
    public UserDTO update(Long id, UserDTO dto) {
        User u = repo.findById(id).orElseThrow();
        u.setUsername(dto.getUsername()); u.setEmail(dto.getEmail());
        if (dto.getPassword()!=null && !dto.getPassword().isBlank()) u.setPassword(encoder.encode(dto.getPassword()));
        if (dto.getRoleId()!=null) u.setRole(roleRepo.findById(dto.getRoleId()).orElseThrow());
        if (dto.getActive()!=null) u.setActive(dto.getActive());
        return toDTO(repo.save(u));
    }
    public void delete(Long id) { repo.deleteById(id); }

    public UserDTO toDTO(User u) {
        UserDTO d = new UserDTO();
        d.setId(u.getId()); d.setUsername(u.getUsername()); d.setEmail(u.getEmail()); d.setActive(u.getActive());
        if (u.getRole()!=null) { d.setRoleId(u.getRole().getId()); d.setRoleName(u.getRole().getName()); }
        return d;
    }
}
