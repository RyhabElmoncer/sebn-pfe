package com.sebn.formation.controller;
import com.sebn.formation.service.InscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/inscriptions") @CrossOrigin(origins="http://localhost:3000")
public class InscriptionController {
    @Autowired private InscriptionService svc;
    @GetMapping public ResponseEntity<?> getAll() { return ResponseEntity.ok(svc.getAll()); }
    @GetMapping("/employe/{eid}") public ResponseEntity<?> byEmploye(@PathVariable Long eid) { return ResponseEntity.ok(svc.getByEmploye(eid)); }
    @GetMapping("/formation/{fid}") public ResponseEntity<?> byFormation(@PathVariable Long fid) { return ResponseEntity.ok(svc.getByFormation(fid)); }
    @PostMapping public ResponseEntity<?> inscrire(@RequestBody Map<String,Long> body) {
        try { return ResponseEntity.ok(svc.inscrire(body.get("employeId"), body.get("formationId"))); }
        catch(Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
    @PutMapping("/{id}/statut") public ResponseEntity<?> updateStatut(@PathVariable Long id,@RequestBody Map<String,String> body) {
        try { return ResponseEntity.ok(svc.updateStatut(id, body.get("statut"))); }
        catch(Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
    @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable Long id) {
        try { svc.delete(id); return ResponseEntity.ok("Inscription supprimée"); }
        catch(Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
}
