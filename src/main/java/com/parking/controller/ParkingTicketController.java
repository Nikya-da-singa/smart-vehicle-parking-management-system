package com.parking.controller;

import com.parking.entity.ParkingTicket;
import com.parking.service.ParkingTicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
==============================================================================
FILE: ParkingTicketController.java

PURPOSE:
--------
Handles HTTP requests related to parking tickets.

The controller receives requests from Postman
and calls ParkingTicketService.

==============================================================================
*/

@RestController
@RequestMapping("/parking-tickets")
public class ParkingTicketController {

    private final ParkingTicketService parkingTicketService;


    /*
    ==========================================================================
    CONSTRUCTOR
    ==========================================================================
    */

    public ParkingTicketController(
            ParkingTicketService parkingTicketService) {

        this.parkingTicketService = parkingTicketService;
    }


    /*
    ==========================================================================
    CREATE PARKING TICKET

    PURPOSE:
    --------
    Creates a parking entry for a vehicle.

    API:
    ----
    POST /parking-tickets/entry

    Example:
    --------
    POST /parking-tickets/entry?vehicleId=1&parkingSlotId=1

    ==========================================================================
    */

    @PostMapping("/entry")
    public ParkingTicket createParkingTicket(
            @RequestParam Long vehicleId,
            @RequestParam Long parkingSlotId) {

        return parkingTicketService.createParkingTicket(
                vehicleId,
                parkingSlotId
        );
    }


    /*
    ==========================================================================
    GET ALL PARKING TICKETS

    API:
    ----
    GET /parking-tickets
    ==========================================================================
    */

    @GetMapping
    public List<ParkingTicket> getAllTickets() {

        return parkingTicketService.getAllTickets();
    }


    /*
    ==========================================================================
    GET PARKING TICKET BY ID

    API:
    ----
    GET /parking-tickets/{id}

    Example:
    --------
    GET /parking-tickets/1

    ==========================================================================
    */

    @GetMapping("/{id}")
    public ParkingTicket getTicketById(
            @PathVariable Long id) {

        return parkingTicketService.getTicketById(id);
    }


    /*
    ==========================================================================
    GET TICKETS BY VEHICLE

    API:
    ----
    GET /parking-tickets/vehicle/{vehicleId}

    Example:
    --------
    GET /parking-tickets/vehicle/1

    ==========================================================================
    */

    @GetMapping("/vehicle/{vehicleId}")
    public List<ParkingTicket> getTicketsByVehicle(
            @PathVariable Long vehicleId) {

        return parkingTicketService
                .getTicketsByVehicle(vehicleId);
    }


    /*
    ==========================================================================
    GET TICKETS BY PARKING SLOT

    API:
    ----
    GET /parking-tickets/slot/{parkingSlotId}

    Example:
    --------
    GET /parking-tickets/slot/1

    ==========================================================================
    */

    @GetMapping("/slot/{parkingSlotId}")
    public List<ParkingTicket> getTicketsBySlot(
            @PathVariable Long parkingSlotId) {

        return parkingTicketService
                .getTicketsBySlot(parkingSlotId);
    }


    /*
    ==========================================================================
    GET TICKETS BY STATUS

    API:
    ----
    GET /parking-tickets/status/{status}

    Example:
    --------
    GET /parking-tickets/status/ACTIVE

    ==========================================================================
    */

    @GetMapping("/status/{status}")
    public List<ParkingTicket> getTicketsByStatus(
            @PathVariable String status) {

        return parkingTicketService
                .getTicketsByStatus(status);
    }
    /*
==============================================================================
VEHICLE EXIT

API:
----
POST /parking-tickets/exit/{ticketId}

Example:
--------
POST /parking-tickets/exit/1
==============================================================================
*/

    @PostMapping("/exit/{ticketId}")
    public ParkingTicket exitVehicle(
            @PathVariable Long ticketId) {

        return parkingTicketService.exitVehicle(ticketId);
    }
    /*
==============================================================================
METHOD: getParkingHistory()

PURPOSE:
--------
Returns all completed parking tickets.

API:
----
GET /parking-tickets/history
==============================================================================
*/

    @GetMapping("/history")
    public List<ParkingTicket> getParkingHistory() {

        return parkingTicketService.getParkingHistory();
    }
}