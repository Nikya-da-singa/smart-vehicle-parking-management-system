package com.parking.repository;

import com.parking.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/*
==============================================================================
FILE: VehicleRepository.java

PURPOSE:
--------
This interface is responsible for communicating with the database.

By extending JpaRepository,
Spring Boot automatically provides common database operations like:

- save()
- findAll()
- findById()
- delete()

We can also create our own custom search methods simply by
writing method names following Spring Data JPA conventions.

No SQL query is required.

==============================================================================
*/

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    /*
    ==============================================================================
    METHOD: findByVehicleNumber()

    PURPOSE:
    --------
    Finds a vehicle using its vehicle number.

    Example:
    --------
    MH01AB1234

    RETURNS:
    --------
    Optional<Vehicle>

    ==============================================================================
    */

    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);

    /*
    ==============================================================================
    METHOD: findByStatus()

    PURPOSE:
    --------
    Returns all vehicles having the given status.

    Example:
    --------
    Parked
    Exited

    RETURNS:
    --------
    List<Vehicle>

    ==============================================================================
    */

    List<Vehicle> findByStatus(String status);

    /*
    ==============================================================================
    METHOD: findByVehicleType()

    PURPOSE:
    --------
    Returns all vehicles of the given type.

    Example:
    --------
    Car
    Bike
    Truck

    RETURNS:
    --------
    List<Vehicle>

    ==============================================================================
    */

    List<Vehicle> findByVehicleType(String vehicleType);

}