package com.sebn.formation.controller;
import com.sebn.formation.dto.RoleDTO;
import com.sebn.formation.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/roles") @CrossOrigin(origins="http://localhost:3000")
public class RoleController {
    @Autowired private RoleService svc;
    @GetMapping public ResponseEntity<List<RoleDTO>> getAll() { return ResponseEntity.ok(svc.getAll()); }
    @GetMapping("/{id}") public ResponseEntity<?> getById(@PathVariable Long id) { try{return ResponseEntity.ok(svc.getById(id));}catch(Exception e){return ResponseEntity.notFound().build();} }
    @PostMapping public ResponseEntity<?> create(@RequestBody RoleDTO dto) { try{return ResponseEntity.ok(svc.create(dto));}catch(Exception e){return ResponseEntity.badRequest().body(e.getMessage());} }
    @PutMapping("/{id}") public ResponseEntity<?> update(@PathVariable Long id,@RequestBody RoleDTO dto) { try{return ResponseEntity.ok(svc.update(id,dto));}catch(Exception e){return ResponseEntity.badRequest().body(e.getMessage());} }
    @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable Long id) { try{svc.delete(id);return ResponseEntity.ok("Supprimé");}catch(Exception e){return ResponseEntity.badRequest().body(e.getMessage());} }
}
