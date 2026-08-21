package com.parking.repository;

import com.parking.entity.ParkingTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
==============================================================================
FILE: ParkingTicketRepository.java

PURPOSE:
--------
Handles database operations for ParkingTicket.

JpaRepository automatically provides:

save()
findAll()
findById()
deleteById()
existsById()

Custom methods are automatically converted into database queries
by Spring Data JPA.
==============================================================================
*/

@Repository
public interface ParkingTicketRepository
        extends JpaRepository<ParkingTicket, Long> {


    /*
    ==========================================================================
    FIND TICKETS BY VEHICLE

    Example:
    vehicleId = 1

    Returns all parking tickets belonging to Vehicle 1.
    ==========================================================================
    */

    List<ParkingTicket> findByVehicleId(Long vehicleId);


    /*
    ==========================================================================
    FIND TICKETS BY PARKING SLOT

    Example:
    parkingSlotId = 1

    Returns all tickets associated with Parking Slot 1.
    ==========================================================================
    */

    List<ParkingTicket> findByParkingSlotId(Long parkingSlotId);


    /*
    ==========================================================================
    FIND TICKETS BY STATUS

    Examples:

    ACTIVE
    COMPLETED

    Used for Parking History.

    Parking History will use:

    COMPLETED
    ==========================================================================
    */

    List<ParkingTicket> findByStatus(String status);
}