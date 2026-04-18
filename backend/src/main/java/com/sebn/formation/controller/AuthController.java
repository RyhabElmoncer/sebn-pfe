package com.sebn.formation.controller;
import com.sebn.formation.dto.*;
import com.sebn.formation.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @CrossOrigin(origins="http://localhost:3000")
public class AuthController {
    @Autowired private AuthService svc;
    @PostMapping("/login") public ResponseEntity<?> login(@RequestBody LoginRequest r) {
        try { return ResponseEntity.ok(svc.login(r)); } catch(Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
    @PostMapping("/register") public ResponseEntity<?> register(@RequestBody RegisterRequest r) {
        try { return ResponseEntity.ok(svc.register(r)); } catch(Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
}
