package com.parking.repository;

import com.parking.entity.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/*
==============================================================================
FILE: ParkingSlotRepository.java

PURPOSE:
--------
Handles database operations for ParkingSlot.

JpaRepository automatically provides:

save()
findAll()
findById()
deleteById()
existsById()

Custom methods below are automatically converted into database queries
by Spring Data JPA.
==============================================================================
*/

public interface ParkingSlotRepository
        extends JpaRepository<ParkingSlot, Long> {


    /*
    ==========================================================================
    FIND ALL SLOTS OF A PARTICULAR FLOOR

    Example:
    Floor ID = 1

    Returns all parking slots belonging to Floor 1.
    ==========================================================================
    */

    List<ParkingSlot> findByFloorId(Long floorId);


    /*
    ==========================================================================
    COUNT SLOTS BY FLOOR AND STATUS

    Used for Parking Availability.

    Example:

    Floor ID = 1
    Status = OCCUPIED

    Returns:
    Number of occupied slots on Floor 1.
    ==========================================================================
    */

    long countByFloorIdAndStatus(
            Long floorId,
            String status
    );


    /*
    ==========================================================================
    CHECK WHETHER A SLOT NUMBER ALREADY EXISTS ON A FLOOR

    Example:

    Floor 1 + Slot A1

    Returns true if A1 already exists on Floor 1.
    ==========================================================================
    */

    boolean existsBySlotNumberAndFloorId(
            String slotNumber,
            Long floorId
    );
}