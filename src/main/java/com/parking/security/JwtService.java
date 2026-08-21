package com.parking.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/*
==============================================================================
FILE: JwtService.java

PURPOSE:
--------
This class is responsible for creating and reading JWT tokens.

JWT is used to identify an authenticated user after login.

FLOW:
-----
User Login
    ↓
Email + Password verified
    ↓
JwtService creates JWT
    ↓
Token is returned to the user
    ↓
User sends JWT with protected requests

==============================================================================
*/

@Service
public class JwtService {

    /*
    ==========================================================================
    SECRET KEY

    This key is used to create and verify JWT tokens.

    IMPORTANT:
    ----------
    For learning purposes, the key is written here.

    Later, we will move this key into application.properties.
    ==========================================================================
    */

    private static final String SECRET_KEY =
            "smart-parking-management-system-secret-key-2026-secure";


    /*
    ==========================================================================
    TOKEN EXPIRATION

    The JWT token will be valid for 24 hours.

    24 hours = 24 × 60 × 60 × 1000 milliseconds
    ==========================================================================
    */

    private static final long EXPIRATION_TIME =
            24 * 60 * 60 * 1000;


    /*
    ==========================================================================
    METHOD: getSigningKey()

    PURPOSE:
    --------
    Converts our secret string into a SecretKey.

    This key is used to sign and verify JWT tokens.

    ==========================================================================
    */

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }


    /*
    ==========================================================================
    METHOD: generateToken()

    PURPOSE:
    --------
    Creates a JWT token for the logged-in user.

    PARAMETERS:
    -----------
    email → user's email
    role  → user's role such as CUSTOMER or ADMIN

    ==========================================================================
    */

    public String generateToken(String email, String role) {

        return Jwts.builder()

                // Store the user's email as the subject.
                .subject(email)

                // Store the user's role inside the token.
                .claim("role", role)

                // Store the token creation time.
                .issuedAt(new Date())

                // Set token expiration time.
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION_TIME
                        )
                )

                // Sign the token using our secret key.
                .signWith(getSigningKey())

                // Create the final JWT string.
                .compact();
    }


    /*
    ==========================================================================
    METHOD: extractEmail()

    PURPOSE:
    --------
    Gets the user's email from the JWT token.

    ==========================================================================
    */

    public String extractEmail(String token) {

        return extractAllClaims(token)
                .getSubject();
    }


    /*
    ==========================================================================
    METHOD: extractRole()

    PURPOSE:
    --------
    Gets the user's role from the JWT token.

    Example:
    --------
    CUSTOMER
    ADMIN

    ==========================================================================
    */

    public String extractRole(String token) {

        return extractAllClaims(token)
                .get("role", String.class);
    }


    /*
    ==========================================================================
    METHOD: extractAllClaims()

    PURPOSE:
    --------
    Reads all information stored inside the JWT token.

    ==========================================================================
    */

    private Claims extractAllClaims(String token) {

        return Jwts.parser()

                // Use the secret key to verify the token.
                .verifyWith(getSigningKey())

                // Build the JWT parser.
                .build()

                // Parse and verify the JWT.
                .parseSignedClaims(token)

                // Get the token's payload/claims.
                .getPayload();
    }


    /*
    ==========================================================================
    METHOD: isTokenValid()

    PURPOSE:
    --------
    Checks whether:

    1. The email inside the token matches the user's email.
    2. The token has not expired.

    ==========================================================================
    */

    public boolean isTokenValid(String token, String email) {

        String tokenEmail = extractEmail(token);

        return tokenEmail.equals(email)
                && !isTokenExpired(token);
    }


    /*
    ==========================================================================
    METHOD: isTokenExpired()

    PURPOSE:
    --------
    Checks whether the JWT token has expired.

    ==========================================================================
    */

    private boolean isTokenExpired(String token) {

        Date expirationDate =
                extractAllClaims(token)
                        .getExpiration();

        return expirationDate.before(new Date());
    }
}