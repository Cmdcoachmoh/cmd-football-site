# Stage 1: Build with Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY cmd-football-backend/ ./cmd-football-backend/
WORKDIR /app/cmd-football-backend
RUN mvn clean package -DskipTests

# Stage 2: Run the packaged app
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/cmd-football-backend/target/cmd-football-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]