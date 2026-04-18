package com.sebn.formation.controller;
import com.sebn.formation.dto.FormationDTO;
import com.sebn.formation.service.FormationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/formations") @CrossOrigin(origins="http://localhost:3000")
public class FormationController {
    @Autowired private FormationService svc;
    @GetMapping public ResponseEntity<List<FormationDTO>> getAll() { return ResponseEntity.ok(svc.getAll()); }
    @GetMapping("/{id}") public ResponseEntity<?> getById(@PathVariable Long id) { try{return ResponseEntity.ok(svc.getById(id));}catch(Exception e){return ResponseEntity.notFound().build();} }
    @PostMapping public ResponseEntity<?> create(@RequestBody FormationDTO dto) { try{return ResponseEntity.ok(svc.create(dto));}catch(Exception e){return ResponseEntity.badRequest().body(e.getMessage());} }
    @PutMapping("/{id}") public ResponseEntity<?> update(@PathVariable Long id,@RequestBody FormationDTO dto) { try{return ResponseEntity.ok(svc.update(id,dto));}catch(Exception e){return ResponseEntity.badRequest().body(e.getMessage());} }
    @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable Long id) { try{svc.delete(id);return ResponseEntity.ok("Supprimé");}catch(Exception e){return ResponseEntity.badRequest().body(e.getMessage());} }
}
