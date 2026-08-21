# =============================================================================
# Stage 1: Build Spring Boot Application with Maven
# =============================================================================
FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source and build jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# =============================================================================
# Stage 2: Minimal Production JRE Runtime
# =============================================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root system user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy packaged jar from build stage
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
