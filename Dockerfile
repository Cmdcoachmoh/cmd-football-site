FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

COPY . .

WORKDIR /app/cmd-football-backend

RUN mvn clean install

CMD ["mvn", "exec:java", "-Dexec.mainClass=com.cmdfootball.Server"]