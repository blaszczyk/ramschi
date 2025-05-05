FROM eclipse-temurin:21-alpine
RUN mkdir /opt/app
COPY build/libs/ramschi-server.jar /opt/app
WORKDIR /opt/app
CMD ["java","-Xmx512m", "-jar", "ramschi-server.jar", "--spring.profiles.active=cloud"]
