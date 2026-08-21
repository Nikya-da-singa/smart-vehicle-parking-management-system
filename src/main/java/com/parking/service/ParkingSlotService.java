package com.parking.service;

import com.parking.entity.ParkingFloor;
import com.parking.entity.ParkingSlot;
import com.parking.repository.ParkingFloorRepository;
import com.parking.repository.ParkingSlotRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/*
==============================================================================
FILE: ParkingSlotService.java

PURPOSE:
--------
Contains business logic for parking slot operations.

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
public class ParkingSlotService {

    private final ParkingSlotRepository parkingSlotRepository;

    private final ParkingFloorRepository parkingFloorRepository;


    /*
    ==========================================================================
    CONSTRUCTOR
    ==========================================================================
    */

    public ParkingSlotService(
            ParkingSlotRepository parkingSlotRepository,
            ParkingFloorRepository parkingFloorRepository) {

        this.parkingSlotRepository = parkingSlotRepository;
        this.parkingFloorRepository = parkingFloorRepository;
    }


    /*
    ==========================================================================
    CREATE PARKING SLOT
    ==========================================================================
    */

    public ParkingSlot createSlot(
            Long floorId,
            ParkingSlot parkingSlot) {

        /*
        Find the floor first.
        */

        Optional<ParkingFloor> floor =
                parkingFloorRepository.findById(floorId);

        if (floor.isEmpty()) {

            throw new RuntimeException(
                    "Parking floor not found"
            );
        }


        /*
        Check whether the slot already exists on this floor.
        */

        if (parkingSlotRepository
                .existsBySlotNumberAndFloorId(
                        parkingSlot.getSlotNumber(),
                        floorId)) {

            throw new RuntimeException(
                    "Parking slot already exists on this floor"
            );
        }


        /*
        Set the floor relationship.
        */

        parkingSlot.setFloor(floor.get());


        /*
        If status is not provided, make it AVAILABLE.
        */

        if (parkingSlot.getStatus() == null
                || parkingSlot.getStatus().isBlank()) {

            parkingSlot.setStatus("AVAILABLE");
        }


        /*
        Save the slot.
        */

        return parkingSlotRepository.save(parkingSlot);
    }


    /*
    ==========================================================================
    GET ALL PARKING SLOTS
    ==========================================================================
    */

    public List<ParkingSlot> getAllSlots() {

        return parkingSlotRepository.findAll();
    }


    /*
    ==========================================================================
    GET SLOT BY ID
    ==========================================================================
    */

    public ParkingSlot getSlotById(Long id) {

        Optional<ParkingSlot> slot =
                parkingSlotRepository.findById(id);

        if (slot.isEmpty()) {

            throw new RuntimeException(
                    "Parking slot not found"
            );
        }

        return slot.get();
    }


    /*
    ==========================================================================
    GET ALL SLOTS OF A FLOOR
    ==========================================================================
    */

    public List<ParkingSlot> getSlotsByFloor(
            Long floorId) {

        /*
        Make sure floor exists.
        */

        if (!parkingFloorRepository.existsById(floorId)) {

            throw new RuntimeException(
                    "Parking floor not found"
            );
        }

        return parkingSlotRepository
                .findByFloorId(floorId);
    }


    /*
    ==========================================================================
    UPDATE SLOT STATUS
    ==========================================================================
    */

    public ParkingSlot updateSlotStatus(
            Long id,
            String status) {

        ParkingSlot slot =
                getSlotById(id);

        slot.setStatus(status);

        return parkingSlotRepository.save(slot);
    }


    /*
    ==========================================================================
    DELETE SLOT
    ==========================================================================
    */

    public void deleteSlot(Long id) {

        if (!parkingSlotRepository.existsById(id)) {

            throw new RuntimeException(
                    "Parking slot not found"
            );
        }

        parkingSlotRepository.deleteById(id);
    }
}