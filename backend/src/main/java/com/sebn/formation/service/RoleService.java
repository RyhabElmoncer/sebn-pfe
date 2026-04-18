package com.sebn.formation.service;
import com.sebn.formation.dto.RoleDTO;
import com.sebn.formation.entity.Role;
import com.sebn.formation.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class RoleService {
    @Autowired private RoleRepository repo;
    public List<RoleDTO> getAll() { return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList()); }
    public RoleDTO getById(Long id) { return toDTO(repo.findById(id).orElseThrow()); }
    public RoleDTO create(RoleDTO dto) {
        if (repo.existsByName(dto.getName())) throw new RuntimeException("Rôle déjà existant");
        return toDTO(repo.save(Role.builder().name(dto.getName()).description(dto.getDescription()).build()));
    }
    public RoleDTO update(Long id, RoleDTO dto) {
        Role r = repo.findById(id).orElseThrow(); r.setName(dto.getName()); r.setDescription(dto.getDescription());
        return toDTO(repo.save(r));
    }
    public void delete(Long id) { repo.deleteById(id); }
    private RoleDTO toDTO(Role r) { RoleDTO d=new RoleDTO(); d.setId(r.getId()); d.setName(r.getName()); d.setDescription(r.getDescription()); return d; }
}
