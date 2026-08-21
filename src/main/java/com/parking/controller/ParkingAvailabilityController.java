package com.parking.controller;

import com.parking.dto.ParkingAvailabilityResponse;
import com.parking.service.ParkingAvailabilityService;
import org.springframework.web.bind.annotation.*;

/*
==============================================================================
FILE: ParkingAvailabilityController.java

PURPOSE:
--------
Provides REST APIs for checking parking availability.

API:
----
GET /parking-availability/floor/{floorId}

Example:
--------
GET /parking-availability/floor/1
==============================================================================
*/

@RestController
@RequestMapping("/parking-availability")
public class ParkingAvailabilityController {

    private final ParkingAvailabilityService parkingAvailabilityService;


    /*
    ==========================================================================
    CONSTRUCTOR
    ==========================================================================
    */

    public ParkingAvailabilityController(
            ParkingAvailabilityService parkingAvailabilityService) {

        this.parkingAvailabilityService =
                parkingAvailabilityService;
    }


    /*
    ==========================================================================
    GET PARKING AVAILABILITY

    Returns:

    - Floor ID
    - Floor number
    - Total slots
    - Occupied slots
    - Available slots
    ==========================================================================
    */

    @GetMapping("/floor/{floorId}")
    public ParkingAvailabilityResponse getAvailability(
            @PathVariable Long floorId) {

        return parkingAvailabilityService
                .getAvailability(floorId);
    }
}