package com.parking.repository;

import com.parking.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/*
==============================================================================
FILE: UserRepository.java

PURPOSE:
--------
This interface communicates with the users table in MySQL.

It provides database operations such as:
    - Save user
    - Find user
    - Find all users
    - Delete user

CUSTOM METHOD:
--------------
findByEmail()

This method is used during:
    1. Registration
    2. Login
==============================================================================
*/

public interface UserRepository extends JpaRepository<User, Integer> {

    /*
    ==========================================================================
    METHOD: findByEmail()

    PURPOSE:
    --------
    Finds a user using their email address.

    Optional is used because the email may or may not exist.

    Example:
    --------
    customer@gmail.com
    ==========================================================================
    */

    Optional<User> findByEmail(String email);
}