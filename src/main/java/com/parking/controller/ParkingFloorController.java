package com.parking.controller;

import com.parking.entity.ParkingFloor;
import com.parking.service.ParkingFloorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
==============================================================================
FILE: ParkingFloorController.java

PURPOSE:
--------
Provides REST APIs for parking floor management.

AVAILABLE APIs:

POST   /parking-floors
GET    /parking-floors
GET    /parking-floors/{id}
DELETE /parking-floors/{id}

==============================================================================
*/

@RestController
@RequestMapping("/parking-floors")
public class ParkingFloorController {

    private final ParkingFloorService parkingFloorService;


    /*
    ==========================================================================
    CONSTRUCTOR
    ==========================================================================
    */

    public ParkingFloorController(
            ParkingFloorService parkingFloorService) {

        this.parkingFloorService = parkingFloorService;
    }


    /*
    ==========================================================================
    CREATE PARKING FLOOR

    POST /parking-floors
    ==========================================================================
    */

    @PostMapping
    public ResponseEntity<ParkingFloor> createFloor(
            @RequestBody ParkingFloor parkingFloor) {

        ParkingFloor createdFloor =
                parkingFloorService.createFloor(parkingFloor);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdFloor);
    }


    /*
    ==========================================================================
    GET ALL PARKING FLOORS

    GET /parking-floors
    ==========================================================================
    */

    @GetMapping
    public ResponseEntity<List<ParkingFloor>> getAllFloors() {

        List<ParkingFloor> floors =
                parkingFloorService.getAllFloors();

        return ResponseEntity.ok(floors);
    }


    /*
    ==========================================================================
    GET PARKING FLOOR BY ID

    GET /parking-floors/{id}

    Example:

    GET /parking-floors/1
    ==========================================================================
    */

    @GetMapping("/{id}")
    public ResponseEntity<ParkingFloor> getFloorById(
            @PathVariable Long id) {

        ParkingFloor floor =
                parkingFloorService.getFloorById(id);

        return ResponseEntity.ok(floor);
    }


    /*
    ==========================================================================
    DELETE PARKING FLOOR

    DELETE /parking-floors/{id}
    ==========================================================================
    */

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFloor(
            @PathVariable Long id) {

        parkingFloorService.deleteFloor(id);

        return ResponseEntity.ok(
                "Parking floor deleted successfully"
        );
    }
}