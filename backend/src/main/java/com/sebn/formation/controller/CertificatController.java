package com.sebn.formation.controller;
import com.sebn.formation.service.CertificatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/certificats") @CrossOrigin(origins="http://localhost:3000")
public class CertificatController {
    @Autowired private CertificatService svc;
    @GetMapping public ResponseEntity<?> getAll() { return ResponseEntity.ok(svc.getAll()); }
    @GetMapping("/employe/{eid}") public ResponseEntity<?> byEmploye(@PathVariable Long eid) { return ResponseEntity.ok(svc.getByEmploye(eid)); }
    @GetMapping("/formation/{fid}") public ResponseEntity<?> byFormation(@PathVariable Long fid) { return ResponseEntity.ok(svc.getByFormation(fid)); }
    @GetMapping("/{id}") public ResponseEntity<?> getById(@PathVariable Long id) { try{return ResponseEntity.ok(svc.getById(id));}catch(Exception e){return ResponseEntity.notFound().build();} }
    @PostMapping("/generer") public ResponseEntity<?> generer(@RequestBody Map<String,Long> body) {
        try { return ResponseEntity.ok(svc.generer(body.get("employeId"), body.get("formationId"))); }
        catch(Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
}
