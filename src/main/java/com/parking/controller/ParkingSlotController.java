package com.parking.controller;

import com.parking.entity.ParkingSlot;
import com.parking.service.ParkingSlotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
==============================================================================
FILE: ParkingSlotController.java

PURPOSE:
--------
Provides REST APIs for parking slot management.

APIs:

POST   /parking-slots/floor/{floorId}
GET    /parking-slots
GET    /parking-slots/{id}
GET    /parking-slots/floor/{floorId}
PUT    /parking-slots/{id}/status
DELETE /parking-slots/{id}

==============================================================================
*/

@RestController
@RequestMapping("/parking-slots")
public class ParkingSlotController {

    private final ParkingSlotService parkingSlotService;


    /*
    ==========================================================================
    CONSTRUCTOR
    ==========================================================================
    */

    public ParkingSlotController(
            ParkingSlotService parkingSlotService) {

        this.parkingSlotService = parkingSlotService;
    }


    /*
    ==========================================================================
    CREATE PARKING SLOT

    POST /parking-slots/floor/{floorId}

    Example:

    POST /parking-slots/floor/1
    ==========================================================================
    */

    @PostMapping("/floor/{floorId}")
    public ResponseEntity<ParkingSlot> createSlot(
            @PathVariable Long floorId,
            @RequestBody ParkingSlot parkingSlot) {

        ParkingSlot createdSlot =
                parkingSlotService.createSlot(
                        floorId,
                        parkingSlot
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdSlot);
    }


    /*
    ==========================================================================
    GET ALL PARKING SLOTS

    GET /parking-slots
    ==========================================================================
    */

    @GetMapping
    public ResponseEntity<List<ParkingSlot>> getAllSlots() {

        List<ParkingSlot> slots =
                parkingSlotService.getAllSlots();

        return ResponseEntity.ok(slots);
    }


    /*
    ==========================================================================
    GET PARKING SLOT BY ID

    GET /parking-slots/{id}
    ==========================================================================
    */

    @GetMapping("/{id}")
    public ResponseEntity<ParkingSlot> getSlotById(
            @PathVariable Long id) {

        ParkingSlot slot =
                parkingSlotService.getSlotById(id);

        return ResponseEntity.ok(slot);
    }


    /*
    ==========================================================================
    GET ALL SLOTS OF A FLOOR

    GET /parking-slots/floor/{floorId}
    ==========================================================================
    */

    @GetMapping("/floor/{floorId}")
    public ResponseEntity<List<ParkingSlot>> getSlotsByFloor(
            @PathVariable Long floorId) {

        List<ParkingSlot> slots =
                parkingSlotService.getSlotsByFloor(
                        floorId
                );

        return ResponseEntity.ok(slots);
    }


    /*
    ==========================================================================
    UPDATE SLOT STATUS

    PUT /parking-slots/{id}/status

    Example:

    PUT /parking-slots/1/status?status=OCCUPIED
    ==========================================================================
    */

    @PutMapping("/{id}/status")
    public ResponseEntity<ParkingSlot> updateSlotStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        ParkingSlot updatedSlot =
                parkingSlotService.updateSlotStatus(
                        id,
                        status
                );

        return ResponseEntity.ok(updatedSlot);
    }


    /*
    ==========================================================================
    DELETE PARKING SLOT

    DELETE /parking-slots/{id}
    ==========================================================================
    */

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSlot(
            @PathVariable Long id) {

        parkingSlotService.deleteSlot(id);

        return ResponseEntity.ok(
                "Parking slot deleted successfully"
        );
    }
}