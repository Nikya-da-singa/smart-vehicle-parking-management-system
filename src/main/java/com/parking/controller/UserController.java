package com.parking.controller;

import com.parking.entity.User;
import com.parking.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/*
==============================================================================
FILE: UserController.java

PURPOSE:
Handles HTTP requests related to users.

ENDPOINTS:

POST   /users/register
POST   /users/login
GET    /users
GET    /users/{id}
DELETE /users/{id}

JWT:
The login endpoint generates a JWT token after successful authentication.
==============================================================================
*/

@RestController
@RequestMapping("/users")
public class UserController {

    /*
    ==========================================================================
    USER SERVICE
    ==========================================================================
    */

    private final UserService userService;


    /*
    ==========================================================================
    CONSTRUCTOR
    ==========================================================================
    */

    public UserController(UserService userService) {
        this.userService = userService;
    }


    /*
    ==========================================================================
    REGISTER USER

    POST /users/register
    ==========================================================================
    */

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(
            @Valid @RequestBody User user) {

        User registeredUser =
                userService.registerUser(user);

        return new ResponseEntity<>(
                registeredUser,
                HttpStatus.CREATED
        );
    }


    /*
    ==========================================================================
    LOGIN USER

    POST /users/login

    FRONTEND SENDS:

    {
        "email": "admin@gmail.com",
        "password": "123456"
    }

    The credentials are received as JSON request body.

    If credentials are correct:
    JWT token is generated and returned.
    ==========================================================================
    */

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(
            @RequestParam String email,
            @RequestParam String password) {

        System.out.println("=================================");
        System.out.println("LOGIN CONTROLLER REACHED");
        System.out.println("EMAIL: " + email);
        System.out.println("=================================");

        Map<String, Object> response =
                userService.loginUser(email, password);

        return ResponseEntity.ok(response);
    }


    /*
    ==========================================================================
    GET ALL USERS

    GET /users
    ==========================================================================
    */

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }


    /*
    ==========================================================================
    GET USER BY ID

    GET /users/{id}
    ==========================================================================
    */

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }


    /*
    ==========================================================================
    DELETE USER

    DELETE /users/{id}
    ==========================================================================
    */

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Integer id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                "User deleted successfully."
        );
    }
}