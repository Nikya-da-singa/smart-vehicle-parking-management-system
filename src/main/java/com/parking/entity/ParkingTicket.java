package com.parking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/*
==============================================================================
FILE: ParkingTicket.java

PURPOSE:
--------
Represents a parking transaction.

When a vehicle enters the parking area, a parking ticket is created.

The ticket connects:

Vehicle
   ↓
ParkingTicket
   ↓
ParkingSlot

It also stores the vehicle's entry and exit information.

==============================================================================
*/

@Entity
@Table(name = "parking_tickets")
public class ParkingTicket {

    /*
    ==========================================================================
    FIELD: id

    PURPOSE:
    --------
    Unique ID of the parking ticket.
    ==========================================================================
    */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    /*
    ==========================================================================
    FIELD: vehicle

    PURPOSE:
    --------
    Identifies which vehicle is using the parking slot.

    MANY tickets can exist for one vehicle over time.
    ==========================================================================
    */

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;


    /*
    ==========================================================================
    FIELD: parkingSlot

    PURPOSE:
    --------
    Identifies which parking slot was assigned to the vehicle.
    ==========================================================================
    */

    @ManyToOne
    @JoinColumn(name = "parking_slot_id", nullable = false)
    private ParkingSlot parkingSlot;


    /*
    ==========================================================================
    FIELD: entryTime

    PURPOSE:
    --------
    Stores the date and time when the vehicle entered.
    ==========================================================================
    */

    @Column(nullable = false)
    private LocalDateTime entryTime;


    /*
    ==========================================================================
    FIELD: exitTime

    PURPOSE:
    --------
    Stores the date and time when the vehicle exited.

    It is NULL while the vehicle is still parked.
    ==========================================================================
    */

    private LocalDateTime exitTime;


    /*
    ==========================================================================
    FIELD: status

    PURPOSE:
    --------
    Stores the current parking ticket status.

    Examples:

    ACTIVE
    COMPLETED
    ==========================================================================
    */

    @Column(nullable = false)
    private String status;


    /*
    ==========================================================================
    FIELD: amount

    PURPOSE:
    --------
    Stores the parking amount.

    Initially this can be 0.

    The amount can later be calculated when the vehicle exits.
    ==========================================================================
    */

    @Column(nullable = false)
    private Double amount;


    /*
    ==========================================================================
    DEFAULT CONSTRUCTOR

    Required by JPA/Hibernate.
    ==========================================================================
    */

    public ParkingTicket() {
    }


    /*
    ==========================================================================
    PARAMETERIZED CONSTRUCTOR
    ==========================================================================
    */

    public ParkingTicket(
            Long id,
            Vehicle vehicle,
            ParkingSlot parkingSlot,
            LocalDateTime entryTime,
            LocalDateTime exitTime,
            String status,
            Double amount) {

        this.id = id;
        this.vehicle = vehicle;
        this.parkingSlot = parkingSlot;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.status = status;
        this.amount = amount;
    }


    /*
    ==========================================================================
    GETTER AND SETTER FOR ID
    ==========================================================================
    */

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    /*
    ==========================================================================
    GETTER AND SETTER FOR VEHICLE
    ==========================================================================
    */

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }


    /*
    ==========================================================================
    GETTER AND SETTER FOR PARKING SLOT
    ==========================================================================
    */

    public ParkingSlot getParkingSlot() {
        return parkingSlot;
    }

    public void setParkingSlot(ParkingSlot parkingSlot) {
        this.parkingSlot = parkingSlot;
    }


    /*
    ==========================================================================
    GETTER AND SETTER FOR ENTRY TIME
    ==========================================================================
    */

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }


    /*
    ==========================================================================
    GETTER AND SETTER FOR EXIT TIME
    ==========================================================================
    */

    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public void setExitTime(LocalDateTime exitTime) {
        this.exitTime = exitTime;
    }


    /*
    ==========================================================================
    GETTER AND SETTER FOR STATUS
    ==========================================================================
    */

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    /*
    ==========================================================================
    GETTER AND SETTER FOR AMOUNT
    ==========================================================================
    */

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}