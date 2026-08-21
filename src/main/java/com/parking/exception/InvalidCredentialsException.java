package com.parking.exception;

/*
==============================================================================
FILE: InvalidCredentialsException.java

PURPOSE:
--------
This exception is thrown when a user provides incorrect login credentials.

Examples:
---------
1. Email does not exist.
2. Password is incorrect.

This exception is handled by GlobalExceptionHandler and converted into
HTTP 401 Unauthorized.

==============================================================================
*/

public class InvalidCredentialsException extends RuntimeException {

    /*
    ==========================================================================
    CONSTRUCTOR

    PURPOSE:
    --------
    Passes the error message to RuntimeException.
    ==========================================================================
    */

    public InvalidCredentialsException(String message) {

        super(message);
    }
}