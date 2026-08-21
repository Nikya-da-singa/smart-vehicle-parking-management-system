package com.parking.service;

import com.parking.dto.ParkingAvailabilityResponse;
import com.parking.entity.ParkingFloor;
import com.parking.repository.ParkingFloorRepository;
import com.parking.repository.ParkingSlotRepository;
import com.parking.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

/*
==============================================================================
FILE: ParkingAvailabilityService.java

PURPOSE:
--------
Calculates parking availability for a particular floor.

It calculates:

Total Slots
Occupied Slots
Available Slots

Formula:

Available Slots = Total Slots - Occupied Slots
==============================================================================
*/

@Service
public class ParkingAvailabilityService {

    private final ParkingFloorRepository parkingFloorRepository;
    private final ParkingSlotRepository parkingSlotRepository;


    /*
    ==========================================================================
    CONSTRUCTOR
    ==========================================================================
    */

    public ParkingAvailabilityService(
            ParkingFloorRepository parkingFloorRepository,
            ParkingSlotRepository parkingSlotRepository) {

        this.parkingFloorRepository = parkingFloorRepository;
        this.parkingSlotRepository = parkingSlotRepository;
    }


    /*
    ==========================================================================
    METHOD: getAvailability()

    PURPOSE:
    --------
    Returns parking availability information for a particular floor.

    Example:

    GET /parking-availability/floor/1

    Response:

    Floor       : 1
    Total       : 50
    Occupied    : 10
    Available   : 40
    ==========================================================================
    */

    public ParkingAvailabilityResponse getAvailability(Long floorId) {

        /*
        ======================================================================
        STEP 1: FIND PARKING FLOOR
        ======================================================================
        */

        ParkingFloor floor =
                parkingFloorRepository.findById(floorId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Parking floor not found with ID : "
                                                + floorId
                                )
                        );


        /*
        ======================================================================
        STEP 2: COUNT OCCUPIED SLOTS
        ======================================================================
        */

        long occupiedSlots =
                parkingSlotRepository
                        .countByFloorIdAndStatus(
                                floorId,
                                "OCCUPIED"
                        );


        /*
        ======================================================================
        STEP 3: GET TOTAL SLOTS
        ======================================================================
        */

        Integer totalSlots =
                floor.getTotalSlots();


        /*
        ======================================================================
        STEP 4: CALCULATE AVAILABLE SLOTS

        Formula:

        Available = Total - Occupied
        ======================================================================
        */

        long availableSlots =
                totalSlots - occupiedSlots;


        /*
        ======================================================================
        STEP 5: CREATE DTO RESPONSE
        ======================================================================
        */

        return new ParkingAvailabilityResponse(
                floor.getId(),
                floor.getFloorNumber(),
                totalSlots,
                occupiedSlots,
                availableSlots
        );
    }
}