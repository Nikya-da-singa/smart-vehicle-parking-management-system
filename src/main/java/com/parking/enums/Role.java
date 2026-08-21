package com.parking.enums;

/*
==============================================================================
FILE: Role.java

PURPOSE:
--------
This enum defines the different types of users
allowed in the Smart Vehicle Parking Management System.

AVAILABLE ROLES:
----------------
1. ADMIN
   - Manages the parking system.
   - Can manage users, vehicles, floors, slots, tickets, etc.

2. CUSTOMER
   - Uses the parking system.
   - Can register vehicles, park vehicles, and view parking information.

==============================================================================
*/

public enum Role {

    /*
    ==========================================================================
    ADMIN ROLE
    ==========================================================================
    */
    ADMIN,

    /*
    ==========================================================================
    CUSTOMER ROLE
    ==========================================================================
    */
    CUSTOMER
}