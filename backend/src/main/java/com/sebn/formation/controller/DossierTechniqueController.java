package com.sebn.formation.controller;
import com.sebn.formation.dto.DossierTechniqueDTO;
import com.sebn.formation.service.DossierTechniqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/dossiers") @CrossOrigin(origins="http://localhost:3000")
public class DossierTechniqueController {
    @Autowired private DossierTechniqueService svc;
    @GetMapping public ResponseEntity<List<DossierTechniqueDTO>> getAll() { return ResponseEntity.ok(svc.getAll()); }
    @GetMapping("/formation/{fid}") public ResponseEntity<List<DossierTechniqueDTO>> getByFormation(@PathVariable Long fid) { return ResponseEntity.ok(svc.getByFormation(fid)); }
    @GetMapping("/{id}") public ResponseEntity<?> getById(@PathVariable Long id) { try{return ResponseEntity.ok(svc.getById(id));}catch(Exception e){return ResponseEntity.notFound().build();} }
    @PostMapping public ResponseEntity<?> create(@RequestBody DossierTechniqueDTO dto) { try{return ResponseEntity.ok(svc.create(dto));}catch(Exception e){return ResponseEntity.badRequest().body(e.getMessage());} }
    @PutMapping("/{id}") public ResponseEntity<?> update(@PathVariable Long id,@RequestBody DossierTechniqueDTO dto) { try{return ResponseEntity.ok(svc.update(id,dto));}catch(Exception e){return ResponseEntity.badRequest().body(e.getMessage());} }
    @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable Long id) { try{svc.delete(id);return ResponseEntity.ok("Supprimé");}catch(Exception e){return ResponseEntity.badRequest().body(e.getMessage());} }
}
