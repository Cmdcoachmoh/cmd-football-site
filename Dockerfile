FROM maven:3.8.7-openjdk-17

WORKDIR /app

COPY . .

RUN mvn clean install

CMD ["mvn", "exec:java", "-Dexec.mainClass=com.cmdfootball.Server"]