package com.sebn.formation.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
@Component
public class JwtUtil {
    @Value("${jwt.secret}") private String secret;
    @Value("${jwt.expiration}") private Long expiration;
    private Key getKey() { return Keys.hmacShaKeyFor(secret.getBytes()); }
    public String generateToken(UserDetails u) { return createToken(new HashMap<>(), u.getUsername()); }
    private String createToken(Map<String,Object> claims, String subject) {
        return Jwts.builder().setClaims(claims).setSubject(subject)
                .setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis()+expiration))
                .signWith(getKey(), SignatureAlgorithm.HS256).compact();
    }
    public boolean validateToken(String token, UserDetails u) {
        return extractUsername(token).equals(u.getUsername()) && !isExpired(token);
    }
    public String extractUsername(String t) { return extractClaim(t, Claims::getSubject); }
    private boolean isExpired(String t) { return extractClaim(t,Claims::getExpiration).before(new Date()); }
    public <T> T extractClaim(String t, Function<Claims,T> fn) {
        return fn.apply(Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(t).getBody());
    }
}
