


package com.example.demo.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secret;

    // =====================================================
    // GET SIGNING KEY
    // =====================================================

    private Key getSigningKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    // =====================================================
    // EXTRACT USERNAME
    // =====================================================

    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }

    // =====================================================
    // EXTRACT EXPIRATION
    // =====================================================

    public Date extractExpiration(String token) {

        return extractClaim(
                token,
                Claims::getExpiration
        );
    }

    // =====================================================
    // EXTRACT CLAIM
    // =====================================================

    public <T> T extractClaim(
            String token,
            Function<Claims, T> resolver) {

        Claims claims = extractAllClaims(token);

        return resolver.apply(claims);
    }

    // =====================================================
    // EXTRACT ALL CLAIMS
    // =====================================================

    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // =====================================================
    // CHECK TOKEN EXPIRATION
    // =====================================================

    private boolean isTokenExpired(String token) {

        return extractExpiration(token)
                .before(new Date());
    }

    // =====================================================
    // GENERATE JWT TOKEN
    // TOKEN VALID FOR 60 DAYS
    // =====================================================

    public String generateToken(String username) {

        Date now = new Date();

        // =================================================
        // 60 DAYS
        // 60 × 24 × 60 × 60 × 1000 milliseconds
        // =================================================

        long sixtyDays =
                60L * 24 * 60 * 60 * 1000;

        Date expiry =
                new Date(now.getTime() + sixtyDays);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    // =====================================================
    // VALIDATE TOKEN
    // =====================================================

    public boolean validateToken(
            String token,
            String username) {

        try {

            String extractedUsername =
                    extractUsername(token);

            return extractedUsername.equals(username)
                    && !isTokenExpired(token);

        } catch (Exception e) {

            System.out.println(
                    "JWT Validation Error : "
                    + e.getMessage()
            );

            return false;
        }
    }
}