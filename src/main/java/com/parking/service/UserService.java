package com.parking.service;

import com.parking.entity.User;
import com.parking.exception.EmailAlreadyExistsException;
import com.parking.exception.InvalidCredentialsException;
import com.parking.exception.ResourceNotFoundException;
import com.parking.repository.UserRepository;
import com.parking.security.JwtService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
==============================================================================
FILE: UserService.java

PURPOSE:
--------
This class contains the business logic related to users.

MAIN RESPONSIBILITIES:
----------------------
1. Register a new user.
2. Check whether email already exists.
3. Login a user.
4. Verify email and password.
5. Generate JWT token after successful login.
6. Get users.
7. Find user by ID.
8. Delete user.

JWT FLOW:
---------
User enters email + password
            ↓
      UserService checks
            ↓
       Credentials correct
            ↓
       JwtService creates token
            ↓
        Token returned
            ↓
       User can use token
       for protected APIs

==============================================================================
*/

@Service
public class UserService {

    /*
    ==========================================================================
    REPOSITORY
    ==========================================================================
    */

    private final UserRepository userRepository;


    /*
    ==========================================================================
    JWT SERVICE

    Used to generate JWT tokens after successful login.
    ==========================================================================
    */

    private final JwtService jwtService;


    /*
    ==========================================================================
    CONSTRUCTOR
    ==========================================================================
    */

    public UserService(UserRepository userRepository,
                       JwtService jwtService) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }


    /*
    ==========================================================================
    METHOD: registerUser()

    PURPOSE:
    --------
    Registers a new user into the database.

    BEFORE SAVING:
    -------------
    1. Check whether email already exists.
    2. If email exists, throw EmailAlreadyExistsException.
    3. Set account creation time.
    4. Save the user.

    ==========================================================================
    */

    public User registerUser(User user) {

        /*
        Check whether another user already has this email.
        */

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {

            throw new EmailAlreadyExistsException(
                    "Email already exists."
            );
        }


        /*
        Set account creation date and time.
        */

        user.setCreatedAt(LocalDateTime.now());


        /*
        Save user into database.
        */

        return userRepository.save(user);
    }


    /*
    ==========================================================================
    METHOD: loginUser()

    PURPOSE:
    --------
    Logs a user into the system.

    STEPS:
    ------
    1. Find user using email.
    2. If email does not exist → invalid credentials.
    3. Compare password.
    4. If password is incorrect → invalid credentials.
    5. Generate JWT token.
    6. Return token and user information.

    ==========================================================================
    */

    public Map<String, Object> loginUser(String email, String password) {

        /*
        Find user by email.
        */

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password."
                        )
                );


        /*
        Check whether the password is correct.
        */

        if (!user.getPassword().equals(password)) {

            throw new InvalidCredentialsException(
                    "Invalid email or password."
            );
        }


        /*
        Get the user's role.

        Example:
        CUSTOMER
        ADMIN
        */

        String role = user.getRole().toString();


        /*
        Generate JWT token.

        The token contains:
        ------------------
        email
        role
        issued time
        expiration time
        */

        String token = jwtService.generateToken(
                user.getEmail(),
                role
        );


        /*
        Create response.
        */

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login successful");

        response.put("token", token);

        response.put("id", user.getId());

        response.put("name", user.getName());

        response.put("email", user.getEmail());

        response.put("role", role);

        response.put("createdAt", user.getCreatedAt());


        /*
        Return login response.
        */

        return response;
    }


    /*
    ==========================================================================
    METHOD: getAllUsers()

    PURPOSE:
    --------
    Returns all users from the database.
    ==========================================================================
    */

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    /*
    ==========================================================================
    METHOD: getUserById()

    PURPOSE:
    --------
    Finds a user using their ID.

    If user doesn't exist → 404.
    ==========================================================================
    */

    public User getUserById(Integer id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );
    }


    /*
    ==========================================================================
    METHOD: deleteUser()

    PURPOSE:
    --------
    Deletes a user using their ID.
    ==========================================================================
    */

    public void deleteUser(Integer id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );

        userRepository.delete(user);
    }
}