package com.parking.exception;

/*
==============================================================================
FILE: ResourceNotFoundException.java

PURPOSE:
--------
This is a custom exception class.

It is used whenever the requested resource
(such as a Vehicle) does not exist in the database.

Instead of showing a generic error,
this exception provides a meaningful message.

==============================================================================
*/

public class ResourceNotFoundException extends RuntimeException {

    /*
    ==============================================================================
    METHOD: ResourceNotFoundException()

    PURPOSE:
    --------
    Creates a custom exception with a message.

    ==============================================================================
    */
    public ResourceNotFoundException(String message) {
        super(message);
    }

}