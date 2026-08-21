package com.parking.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/*
==============================================================================
FILE: GlobalExceptionHandler.java

PURPOSE:
--------
This class handles exceptions thrown by different parts of the application.

Instead of Spring returning a long error page, this class returns clean
JSON responses.

EXCEPTIONS HANDLED:
-------------------

1. ResourceNotFoundException
       → HTTP 404 NOT FOUND

2. EmailAlreadyExistsException
       → HTTP 409 CONFLICT

3. InvalidCredentialsException
       → HTTP 401 UNAUTHORIZED

4. MethodArgumentNotValidException
       → HTTP 400 BAD REQUEST

==============================================================================
*/

@RestControllerAdvice
public class GlobalExceptionHandler {


    /*
    ==========================================================================
    METHOD: handleResourceNotFoundException()

    PURPOSE:
    --------
    Handles ResourceNotFoundException.

    HTTP STATUS:
    ------------
    404 NOT FOUND

    ==========================================================================
    */

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex) {

        Map<String, Object> error = new HashMap<>();

        // Current date and time.
        error.put("timestamp", LocalDateTime.now());

        // HTTP status code.
        error.put("status", HttpStatus.NOT_FOUND.value());

        // Error type.
        error.put("error", "Not Found");

        // Actual error message.
        error.put("message", ex.getMessage());

        return new ResponseEntity<>(
                error,
                HttpStatus.NOT_FOUND
        );
    }


    /*
    ==========================================================================
    METHOD: handleEmailAlreadyExistsException()

    PURPOSE:
    --------
    Handles duplicate email registration.

    Example:
    --------
    A user tries to register with an email that already exists.

    HTTP STATUS:
    ------------
    409 CONFLICT

    ==========================================================================
    */

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleEmailAlreadyExistsException(
            EmailAlreadyExistsException ex) {

        Map<String, Object> error = new HashMap<>();

        // Current date and time.
        error.put("timestamp", LocalDateTime.now());

        // HTTP status code.
        error.put("status", HttpStatus.CONFLICT.value());

        // Error type.
        error.put("error", "Conflict");

        // Actual error message.
        error.put("message", ex.getMessage());

        return new ResponseEntity<>(
                error,
                HttpStatus.CONFLICT
        );
    }


    /*
    ==========================================================================
    METHOD: handleInvalidCredentialsException()

    PURPOSE:
    --------
    Handles incorrect login credentials.

    Examples:
    ---------
    1. Wrong email.
    2. Wrong password.

    HTTP STATUS:
    ------------
    401 UNAUTHORIZED

    ==========================================================================
    */

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentialsException(
            InvalidCredentialsException ex) {

        Map<String, Object> error = new HashMap<>();

        // Current date and time.
        error.put("timestamp", LocalDateTime.now());

        // HTTP status code.
        error.put("status", HttpStatus.UNAUTHORIZED.value());

        // Error type.
        error.put("error", "Unauthorized");

        // Actual error message.
        error.put("message", ex.getMessage());

        return new ResponseEntity<>(
                error,
                HttpStatus.UNAUTHORIZED
        );
    }


    /*
    ==========================================================================
    METHOD: handleValidationException()

    PURPOSE:
    --------
    Handles validation errors from @Valid.

    Example:
    --------
    If User has:

    @NotBlank
    private String name;

    and name is empty, this method catches the validation error.

    HTTP STATUS:
    ------------
    400 BAD REQUEST

    ==========================================================================
    */

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        /*
        Loop through every validation error.
        */

        ex.getBindingResult()
                .getAllErrors()
                .forEach(error -> {

                    /*
                    Get the name of the field that caused the error.
                    */

                    String fieldName =
                            ((FieldError) error).getField();


                    /*
                    Get the validation message.
                    */

                    String errorMessage =
                            error.getDefaultMessage();


                    /*
                    Store:

                    field → error message
                    */

                    errors.put(
                            fieldName,
                            errorMessage
                    );
                });


        /*
        Return validation errors with HTTP 400.
        */

        return new ResponseEntity<>(
                errors,
                HttpStatus.BAD_REQUEST
        );
    }
}