package com.parking.repository;

import com.parking.entity.ParkingFloor;
import org.springframework.data.jpa.repository.JpaRepository;

/*
==============================================================================
FILE: ParkingFloorRepository.java

PURPOSE:
--------
This repository communicates with the parking_floors table
through Spring Data JPA.

It automatically provides operations such as:

- Save a parking floor
- Find a parking floor
- Find all parking floors
- Delete a parking floor
- Check whether a floor exists

==============================================================================
*/

public interface ParkingFloorRepository
        extends JpaRepository<ParkingFloor, Long> {

    /*
    ==========================================================================
    Check whether a floor number already exists.

    Example:

    If Floor 1 already exists:

    existsByFloorNumber(1)

    returns true.
    ==========================================================================
    */

    boolean existsByFloorNumber(Integer floorNumber);
}