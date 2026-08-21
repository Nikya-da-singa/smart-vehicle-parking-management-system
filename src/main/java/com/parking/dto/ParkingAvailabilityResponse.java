package com.parking.dto;

/*
==============================================================================
FILE: ParkingAvailabilityResponse.java

PURPOSE:
--------
Carries parking availability information from the backend
to the client.

It is a DTO, so it is NOT a database entity.
==============================================================================
*/

public class ParkingAvailabilityResponse {

    private Long floorId;

    private Integer floorNumber;

    private Integer totalSlots;

    private Long occupiedSlots;

    private Long availableSlots;


    /*
    ==========================================================================
    DEFAULT CONSTRUCTOR

    Required for creating an empty DTO object.
    ==========================================================================
    */

    public ParkingAvailabilityResponse() {
    }


    /*
    ==========================================================================
    PARAMETERIZED CONSTRUCTOR

    Used by ParkingAvailabilityService to create the response.

    It accepts:

    1. Floor ID
    2. Floor number
    3. Total slots
    4. Occupied slots
    5. Available slots
    ==========================================================================
    */

    public ParkingAvailabilityResponse(
            Long floorId,
            Integer floorNumber,
            Integer totalSlots,
            Long occupiedSlots,
            Long availableSlots) {

        this.floorId = floorId;
        this.floorNumber = floorNumber;
        this.totalSlots = totalSlots;
        this.occupiedSlots = occupiedSlots;
        this.availableSlots = availableSlots;
    }


    /*
    ==========================================================================
    GETTER AND SETTER - FLOOR ID
    ==========================================================================
    */

    public Long getFloorId() {
        return floorId;
    }

    public void setFloorId(Long floorId) {
        this.floorId = floorId;
    }


    /*
    ==========================================================================
    GETTER AND SETTER - FLOOR NUMBER
    ==========================================================================
    */

    public Integer getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(Integer floorNumber) {
        this.floorNumber = floorNumber;
    }


    /*
    ==========================================================================
    GETTER AND SETTER - TOTAL SLOTS
    ==========================================================================
    */

    public Integer getTotalSlots() {
        return totalSlots;
    }

    public void setTotalSlots(Integer totalSlots) {
        this.totalSlots = totalSlots;
    }


    /*
    ==========================================================================
    GETTER AND SETTER - OCCUPIED SLOTS
    ==========================================================================
    */

    public Long getOccupiedSlots() {
        return occupiedSlots;
    }

    public void setOccupiedSlots(Long occupiedSlots) {
        this.occupiedSlots = occupiedSlots;
    }


    /*
    ==========================================================================
    GETTER AND SETTER - AVAILABLE SLOTS
    ==========================================================================
    */

    public Long getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(Long availableSlots) {
        this.availableSlots = availableSlots;
    }
}