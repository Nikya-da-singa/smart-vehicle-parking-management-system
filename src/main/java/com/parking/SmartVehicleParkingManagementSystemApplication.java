package com.parking;

// Imports the Spring Boot class used to start the application
import org.springframework.boot.SpringApplication;

// Enables Spring Boot's automatic configuration and component scanning
import org.springframework.boot.autoconfigure.SpringBootApplication;

/*
 * =============================================================================
 * Smart Vehicle Parking Management System
 * =============================================================================
 *
 * PURPOSE:
 * --------
 * This is the MAIN class of our Spring Boot application.
 *
 * It is the entry point of the application.
 *
 * When we click the ▶ Run button, execution starts from the main() method.
 *
 * Think of it like:
 *
 * Mobile App  -> Tap App Icon -> App Opens
 *
 * Similarly,
 *
 * Click Run -> main() method executes -> Spring Boot starts
 *
 * =============================================================================
 */

@SpringBootApplication
public class SmartVehicleParkingManagementSystemApplication {

    /*
     * The main() method is the first method executed
     * when the application starts.
     */
    public static void main(String[] args) {

        /*
         * Starts the Spring Boot application.
         *
         * This single line:
         *
         * ✔ Starts the embedded Tomcat server
         * ✔ Reads application.properties
         * ✔ Connects to MySQL
         * ✔ Creates Spring Beans (@Service, @Repository, @Controller)
         * ✔ Creates database tables from @Entity classes
         * ✔ Makes APIs available on http://localhost:8080
         */
        SpringApplication.run(
                SmartVehicleParkingManagementSystemApplication.class,
                args
        );
    }

}