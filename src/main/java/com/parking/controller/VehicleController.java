package com.parking.controller;

import com.parking.entity.Vehicle;
import com.parking.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
==============================================================================
FILE: VehicleController.java

PURPOSE:
--------
This class handles all HTTP requests related to Vehicle operations.

It receives requests from the client (Postman),
calls the Service layer,
and returns the response.

Validation is also performed before saving or updating data.

==============================================================================
*/

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    // Injecting VehicleService to access business logic.
    @Autowired
    private VehicleService vehicleService;

    /*
    ==============================================================================
    METHOD: saveVehicle()

    PURPOSE:
    --------
    Saves a new vehicle into the database.

    API:
    ----
    POST /vehicles

    ==============================================================================
    */
    @PostMapping
    public Vehicle saveVehicle(@Valid @RequestBody Vehicle vehicle) {

        return vehicleService.saveVehicle(vehicle);
    }

    /*
    ==============================================================================
    METHOD: getAllVehicles()

    PURPOSE:
    --------
    Retrieves all vehicle records from the database.

    API:
    ----
    GET /vehicles

    ==============================================================================
    */
    @GetMapping
    public List<Vehicle> getAllVehicles() {

        return vehicleService.getAllVehicles();
    }

    /*
    ==============================================================================
    METHOD: getVehicleById()

    PURPOSE:
    --------
    Retrieves a single vehicle using its ID.

    API:
    ----
    GET /vehicles/{id}

    Example:
    --------
    GET /vehicles/1

    ==============================================================================
    */
    @GetMapping("/{id}")
    public Vehicle getVehicleById(@PathVariable Long id) {

        return vehicleService.getVehicleById(id);
    }

    /*
    ==============================================================================
    METHOD: updateVehicle()

    PURPOSE:
    --------
    Updates all details of an existing vehicle.

    API:
    ----
    PUT /vehicles/{id}

    Example:
    --------
    PUT /vehicles/1

    ==============================================================================
    */
    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id,
                                 @Valid @RequestBody Vehicle vehicle) {

        return vehicleService.updateVehicle(id, vehicle);
    }

    /*
    ==============================================================================
    METHOD: updateVehicleStatus()

    PURPOSE:
    --------
    Updates only the status of a vehicle.

    API:
    ----
    PATCH /vehicles/{id}/status

    Example:
    --------
    PATCH /vehicles/1/status

    ==============================================================================
    */
    @PatchMapping("/{id}/status")
    public Vehicle updateVehicleStatus(@PathVariable Long id,
                                       @RequestBody Vehicle vehicle) {

        return vehicleService.updateVehicleStatus(id, vehicle);
    }

    /*
    ==============================================================================
    METHOD: deleteVehicle()

    PURPOSE:
    --------
    Deletes a vehicle using its ID.

    API:
    ----
    DELETE /vehicles/{id}

    Example:
    --------
    DELETE /vehicles/1

    ==============================================================================
    */
    @DeleteMapping("/{id}")
    public String deleteVehicle(@PathVariable Long id) {

        return vehicleService.deleteVehicle(id);
    }

    /*
    ==============================================================================
    METHOD: getVehicleByNumber()

    PURPOSE:
    --------
    Searches for a vehicle using its vehicle number.

    API:
    ----
    GET /vehicles/search/number/{vehicleNumber}

    Example:
    --------
    GET /vehicles/search/number/MH01AB1234

    ==============================================================================
    */
    @GetMapping("/search/number/{vehicleNumber}")
    public Vehicle getVehicleByNumber(@PathVariable String vehicleNumber) {

        return vehicleService.getVehicleByNumber(vehicleNumber);
    }

    /*
    ==============================================================================
    METHOD: getVehiclesByStatus()

    PURPOSE:
    --------
    Returns all vehicles having the given status.

    API:
    ----
    GET /vehicles/search/status/{status}

    Example:
    --------
    GET /vehicles/search/status/Parked

    ==============================================================================
    */
    @GetMapping("/search/status/{status}")
    public List<Vehicle> getVehiclesByStatus(@PathVariable String status) {

        return vehicleService.getVehiclesByStatus(status);
    }

    /*
    ==============================================================================
    METHOD: getVehiclesByType()

    PURPOSE:
    --------
    Returns all vehicles of the given vehicle type.

    API:
    ----
    GET /vehicles/search/type/{vehicleType}

    Example:
    --------
    GET /vehicles/search/type/Car

    ==============================================================================
    */
    @GetMapping("/search/type/{vehicleType}")
    public List<Vehicle> getVehiclesByType(@PathVariable String vehicleType) {

        return vehicleService.getVehiclesByType(vehicleType);
    }

}