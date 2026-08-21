package com.parking.service;

import com.parking.entity.ParkingSlot;
import com.parking.entity.ParkingTicket;
import com.parking.entity.Vehicle;
import com.parking.exception.ResourceNotFoundException;
import com.parking.repository.ParkingSlotRepository;
import com.parking.repository.ParkingTicketRepository;
import com.parking.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

/*
==============================================================================
FILE: ParkingTicketService.java

PURPOSE:
--------
Contains the business logic for parking ticket operations.

FEATURES:
---------
1. Create parking ticket
2. Get all tickets
3. Get ticket by ID
4. Get tickets by vehicle
5. Get tickets by parking slot
6. Get tickets by status
7. Vehicle exit
8. Dynamic parking fee calculation

PRICING:
--------
Bike  -> ₹20/hour
Car   -> ₹50/hour
Truck -> ₹100/hour
==============================================================================
*/

@Service
public class ParkingTicketService {

    private final ParkingTicketRepository parkingTicketRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingSlotRepository parkingSlotRepository;


    /*
    ==========================================================================
    CONSTRUCTOR
    ==========================================================================
    */

    public ParkingTicketService(
            ParkingTicketRepository parkingTicketRepository,
            VehicleRepository vehicleRepository,
            ParkingSlotRepository parkingSlotRepository) {

        this.parkingTicketRepository = parkingTicketRepository;
        this.vehicleRepository = vehicleRepository;
        this.parkingSlotRepository = parkingSlotRepository;
    }


    /*
    ==========================================================================
    CREATE PARKING TICKET

    PURPOSE:
    --------
    Creates a new parking entry for a vehicle.

    FLOW:
    -----
    Vehicle
       ↓
    Parking Slot
       ↓
    Check slot availability
       ↓
    Vehicle → Parked
       ↓
    Slot → OCCUPIED
       ↓
    Ticket → ACTIVE
    ==========================================================================
    */

    public ParkingTicket createParkingTicket(
            Long vehicleId,
            Long parkingSlotId) {

        /*
        ======================================================================
        STEP 1: FIND VEHICLE
        ======================================================================
        */

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vehicle not found with ID : " + vehicleId
                        )
                );


        /*
        ======================================================================
        STEP 2: FIND PARKING SLOT
        ======================================================================
        */

        ParkingSlot parkingSlot =
                parkingSlotRepository.findById(parkingSlotId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Parking slot not found with ID : "
                                                + parkingSlotId
                                )
                        );


        /*
        ======================================================================
        STEP 3: CHECK SLOT AVAILABILITY
        ======================================================================
        */

        if (!"AVAILABLE".equalsIgnoreCase(
                parkingSlot.getStatus())) {

            throw new RuntimeException(
                    "Parking slot is not available"
            );
        }


        /*
        ======================================================================
        STEP 4: RECORD ENTRY TIME
        ======================================================================
        */

        LocalDateTime entryTime = LocalDateTime.now();


        /*
        ======================================================================
        STEP 5: UPDATE VEHICLE
        ======================================================================
        */

        vehicle.setStatus("Parked");
        vehicle.setEntryTime(entryTime.toString());
        vehicle.setExitTime(null);

        vehicleRepository.save(vehicle);


        /*
        ======================================================================
        STEP 6: OCCUPY PARKING SLOT
        ======================================================================
        */

        parkingSlot.setStatus("OCCUPIED");

        parkingSlotRepository.save(parkingSlot);


        /*
        ======================================================================
        STEP 7: CREATE PARKING TICKET
        ======================================================================
        */

        ParkingTicket ticket = new ParkingTicket();

        ticket.setVehicle(vehicle);
        ticket.setParkingSlot(parkingSlot);
        ticket.setEntryTime(entryTime);
        ticket.setExitTime(null);
        ticket.setStatus("ACTIVE");
        ticket.setAmount(0.0);


        /*
        ======================================================================
        STEP 8: SAVE TICKET
        ======================================================================
        */

        return parkingTicketRepository.save(ticket);
    }


    /*
    ==========================================================================
    GET ALL TICKETS
    ==========================================================================
    */

    public List<ParkingTicket> getAllTickets() {

        return parkingTicketRepository.findAll();
    }


    /*
    ==========================================================================
    GET TICKET BY ID
    ==========================================================================
    */

    public ParkingTicket getTicketById(Long id) {

        return parkingTicketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Parking ticket not found with ID : " + id
                        )
                );
    }


    /*
    ==========================================================================
    GET TICKETS BY VEHICLE
    ==========================================================================
    */

    public List<ParkingTicket> getTicketsByVehicle(
            Long vehicleId) {

        return parkingTicketRepository
                .findByVehicleId(vehicleId);
    }


    /*
    ==========================================================================
    GET TICKETS BY PARKING SLOT
    ==========================================================================
    */

    public List<ParkingTicket> getTicketsBySlot(
            Long parkingSlotId) {

        return parkingTicketRepository
                .findByParkingSlotId(parkingSlotId);
    }


    /*
    ==========================================================================
    GET TICKETS BY STATUS
    ==========================================================================
    */

    public List<ParkingTicket> getTicketsByStatus(
            String status) {

        return parkingTicketRepository
                .findByStatus(status);
    }


    /*
    ==========================================================================
    VEHICLE EXIT
    ==========================================================================

    PURPOSE:
    --------
    Completes an active parking ticket.

    FLOW:
    -----
    ACTIVE TICKET
          ↓
    Record exit time
          ↓
    Calculate duration
          ↓
    Find vehicle type
          ↓
    Select hourly rate
          ↓
    Calculate amount
          ↓
    Ticket → COMPLETED
          ↓
    Vehicle → Exited
          ↓
    Slot → AVAILABLE

    ==========================================================================
    */

    public ParkingTicket exitVehicle(Long ticketId) {

        /*
        ======================================================================
        STEP 1: FIND PARKING TICKET
        ======================================================================
        */

        ParkingTicket ticket =
                parkingTicketRepository.findById(ticketId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Parking ticket not found with ID : "
                                                + ticketId
                                )
                        );


        /*
        ======================================================================
        STEP 2: CHECK TICKET STATUS
        ======================================================================
        */

        if (!"ACTIVE".equalsIgnoreCase(
                ticket.getStatus())) {

            throw new RuntimeException(
                    "Parking ticket is already completed"
            );
        }


        /*
        ======================================================================
        STEP 3: RECORD EXIT TIME
        ======================================================================
        */

        LocalDateTime exitTime = LocalDateTime.now();

        ticket.setExitTime(exitTime);


        /*
        ======================================================================
        STEP 4: GET ENTRY TIME
        ======================================================================
        */

        LocalDateTime entryTime =
                ticket.getEntryTime();


        /*
        ======================================================================
        STEP 5: CALCULATE PARKING DURATION
        ======================================================================
        */

        long minutes =
                Duration.between(
                        entryTime,
                        exitTime
                ).toMinutes();


        /*
        ======================================================================
        STEP 6: CONVERT MINUTES TO HOURS

        Every started hour is charged.

        Examples:

        10 minutes  → 1 hour
        60 minutes  → 1 hour
        61 minutes  → 2 hours
        120 minutes → 2 hours
        121 minutes → 3 hours

        ======================================================================
        */

        long hours =
                (long) Math.ceil(
                        minutes / 60.0
                );


        /*
        ======================================================================
        MINIMUM CHARGE = 1 HOUR
        ======================================================================
        */

        if (hours < 1) {
            hours = 1;
        }


        /*
        ======================================================================
        STEP 7: GET VEHICLE
        ======================================================================
        */

        Vehicle vehicle =
                ticket.getVehicle();


        /*
        ======================================================================
        STEP 8: GET VEHICLE TYPE
        ======================================================================
        */

        String vehicleType =
                vehicle.getVehicleType();


        /*
        ======================================================================
        STEP 9: SELECT DYNAMIC HOURLY RATE

        Bike  → ₹20/hour
        Car   → ₹50/hour
        Truck → ₹100/hour

        ======================================================================
        */

        double ratePerHour;


        if ("Bike".equalsIgnoreCase(vehicleType)) {

            ratePerHour = 20.0;

        } else if ("Car".equalsIgnoreCase(vehicleType)) {

            ratePerHour = 50.0;

        } else if ("Truck".equalsIgnoreCase(vehicleType)) {

            ratePerHour = 100.0;

        } else {

            throw new RuntimeException(
                    "Unsupported vehicle type: "
                            + vehicleType
            );
        }


        /*
        ======================================================================
        STEP 10: CALCULATE FINAL PARKING AMOUNT
        ======================================================================
        */

        double amount =
                hours * ratePerHour;

        ticket.setAmount(amount);


        /*
        ======================================================================
        STEP 11: COMPLETE PARKING TICKET
        ======================================================================
        */

        ticket.setStatus("COMPLETED");


        /*
        ======================================================================
        STEP 12: UPDATE VEHICLE
        ======================================================================
        */

        vehicle.setStatus("Exited");

        vehicle.setExitTime(
                exitTime.toString()
        );

        vehicleRepository.save(vehicle);


        /*
        ======================================================================
        STEP 13: FREE PARKING SLOT
        ======================================================================
        */

        ParkingSlot parkingSlot =
                ticket.getParkingSlot();

        parkingSlot.setStatus("AVAILABLE");

        parkingSlotRepository.save(parkingSlot);


        /*
        ======================================================================
        STEP 14: SAVE COMPLETED TICKET
        ======================================================================
        */

        return parkingTicketRepository.save(ticket);
    }
    /*
==============================================================================
METHOD: getParkingHistory()

PURPOSE:
--------
Returns all completed parking tickets.

Only tickets whose status is COMPLETED are returned.
==============================================================================
*/

    public List<ParkingTicket> getParkingHistory() {

        return parkingTicketRepository.findByStatus("COMPLETED");
    }
}