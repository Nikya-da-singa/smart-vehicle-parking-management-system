package com.parking.service;

import com.parking.entity.Vehicle;
import com.parking.exception.ResourceNotFoundException;
import com.parking.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/*
==============================================================================
FILE: VehicleService.java

PURPOSE:
--------
This class contains the business logic of the application.

It acts as a bridge between the Controller and the Repository.

The Controller calls the methods in this class, and this class
communicates with the database using the Repository.

==============================================================================
*/

@Service
public class VehicleService {

    // Injecting VehicleRepository to perform database operations.
    @Autowired
    private VehicleRepository vehicleRepository;

    /*
    ==============================================================================
    METHOD: saveVehicle()

    PURPOSE:
    --------
    Saves a new vehicle into the database.

    ==============================================================================
    */
    public Vehicle saveVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    /*
    ==============================================================================
    METHOD: getAllVehicles()

    PURPOSE:
    --------
    Retrieves all vehicles from the database.

    ==============================================================================
    */
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    /*
    ==============================================================================
    METHOD: getVehicleById()

    PURPOSE:
    --------
    Retrieves one vehicle using its ID.

    ==============================================================================
    */
    public Vehicle getVehicleById(Long id) {

        return vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vehicle not found with ID : " + id));
    }

    /*
    ==============================================================================
    METHOD: updateVehicle()

    PURPOSE:
    --------
    Updates all details of an existing vehicle.

    ==============================================================================
    */
    public Vehicle updateVehicle(Long id, Vehicle vehicle) {

        Vehicle existingVehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vehicle not found with ID : " + id));

        existingVehicle.setOwnerName(vehicle.getOwnerName());
        existingVehicle.setVehicleNumber(vehicle.getVehicleNumber());
        existingVehicle.setVehicleType(vehicle.getVehicleType());
        existingVehicle.setEntryTime(vehicle.getEntryTime());
        existingVehicle.setExitTime(vehicle.getExitTime());
        existingVehicle.setStatus(vehicle.getStatus());

        return vehicleRepository.save(existingVehicle);
    }

    /*
    ==============================================================================
    METHOD: updateVehicleStatus()

    PURPOSE:
    --------
    Updates only the status of a vehicle.

    ==============================================================================
    */
    public Vehicle updateVehicleStatus(Long id, Vehicle vehicle) {

        Vehicle existingVehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vehicle not found with ID : " + id));

        existingVehicle.setStatus(vehicle.getStatus());

        return vehicleRepository.save(existingVehicle);
    }
    /*
==============================================================================
METHOD: getVehicleByNumber()

PURPOSE:
--------
Searches for a vehicle using its vehicle number.

EXAMPLE:
--------
MH01AB1234

RETURNS:
--------
Single Vehicle object.

==============================================================================
*/
    public Vehicle getVehicleByNumber(String vehicleNumber) {

        return vehicleRepository.findByVehicleNumber(vehicleNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found with Number : " + vehicleNumber));
    }

    /*
    ==============================================================================
    METHOD: getVehiclesByStatus()

    PURPOSE:
    --------
    Returns all vehicles having the given status.

    EXAMPLE:
    --------
    Parked
    Exited

    RETURNS:
    --------
    List of vehicles.

    ==============================================================================
    */
    public List<Vehicle> getVehiclesByStatus(String status) {

        return vehicleRepository.findByStatus(status);
    }

    /*
    ==============================================================================
    METHOD: getVehiclesByType()

    PURPOSE:
    --------
    Returns all vehicles of the given vehicle type.

    EXAMPLE:
    --------
    Car
    Bike
    Truck

    RETURNS:
    --------
    List of vehicles.

    ==============================================================================
    */
    public List<Vehicle> getVehiclesByType(String vehicleType) {

        return vehicleRepository.findByVehicleType(vehicleType);
    }

    /*
    ==============================================================================
    METHOD: deleteVehicle()

    PURPOSE:
    --------
    Deletes a vehicle using its ID.

    ==============================================================================
    */
    public String deleteVehicle(Long id) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vehicle not found with ID : " + id));

        vehicleRepository.delete(vehicle);

        return "Vehicle deleted successfully.";
    }

}