package com.parking.service;

import com.parking.entity.ParkingFloor;
import com.parking.repository.ParkingFloorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/*
==============================================================================
FILE: ParkingFloorService.java

PURPOSE:
--------
Contains the business logic for parking floor operations.

The controller communicates with this service instead of directly
communicating with the repository.

FLOW:

Controller
    ↓
Service
    ↓
Repository
    ↓
MySQL

==============================================================================
*/

@Service
public class ParkingFloorService {

    private final ParkingFloorRepository parkingFloorRepository;


    /*
    ==========================================================================
    CONSTRUCTOR
    ==========================================================================
    */

    public ParkingFloorService(
            ParkingFloorRepository parkingFloorRepository) {

        this.parkingFloorRepository = parkingFloorRepository;
    }


    /*
    ==========================================================================
    CREATE PARKING FLOOR

    Creates a new parking floor.

    Example:

    floorNumber = 1
    totalSlots = 50
    ==========================================================================
    */

    public ParkingFloor createFloor(ParkingFloor parkingFloor) {

        /*
        Check whether the floor number already exists.
        */

        if (parkingFloorRepository.existsByFloorNumber(
                parkingFloor.getFloorNumber())) {

            throw new RuntimeException(
                    "Parking floor already exists"
            );
        }

        return parkingFloorRepository.save(parkingFloor);
    }


    /*
    ==========================================================================
    GET ALL PARKING FLOORS
    ==========================================================================
    */

    public List<ParkingFloor> getAllFloors() {

        return parkingFloorRepository.findAll();
    }


    /*
    ==========================================================================
    GET FLOOR BY ID
    ==========================================================================
    */

    public ParkingFloor getFloorById(Long id) {

        Optional<ParkingFloor> floor =
                parkingFloorRepository.findById(id);

        if (floor.isEmpty()) {

            throw new RuntimeException(
                    "Parking floor not found"
            );
        }

        return floor.get();
    }


    /*
    ==========================================================================
    DELETE PARKING FLOOR
    ==========================================================================
    */

    public void deleteFloor(Long id) {

        if (!parkingFloorRepository.existsById(id)) {

            throw new RuntimeException(
                    "Parking floor not found"
            );
        }

        parkingFloorRepository.deleteById(id);
    }
}