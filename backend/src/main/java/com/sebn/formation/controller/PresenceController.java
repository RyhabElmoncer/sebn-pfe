package com.sebn.formation.controller;
import com.sebn.formation.service.PresenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/presences") @CrossOrigin(origins="http://localhost:3000")
public class PresenceController {
    @Autowired private PresenceService svc;
    @GetMapping("/session/{sid}") public ResponseEntity<?> bySession(@PathVariable Long sid) { return ResponseEntity.ok(svc.getBySession(sid)); }
    @GetMapping("/employe/{eid}") public ResponseEntity<?> byEmploye(@PathVariable Long eid) { return ResponseEntity.ok(svc.getByEmploye(eid)); }
    @GetMapping("/taux/{eid}/{fid}") public ResponseEntity<?> taux(@PathVariable Long eid, @PathVariable Long fid) { return ResponseEntity.ok(Map.of("taux", svc.getTauxPresence(eid, fid))); }
    @PostMapping("/marquer") public ResponseEntity<?> marquer(@RequestBody Map<String,Object> body) {
        try {
            Long eid = Long.valueOf(body.get("employeId").toString());
            Long sid = Long.valueOf(body.get("sessionId").toString());
            boolean present = Boolean.parseBoolean(body.get("present").toString());
            String just = body.containsKey("justification") ? body.get("justification").toString() : null;
            return ResponseEntity.ok(svc.marquer(eid, sid, present, just));
        } catch(Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
}
