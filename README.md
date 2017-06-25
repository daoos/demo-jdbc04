# DEMO-JDBC04

AGENS-Browser bundle applicaiton :

Web DB Client and Visualizaiton Tool for AgensGraph

### Prerequisites

* Java SE 8 / Java 1.8
* Maven 3

### Integration Build (Backend+Frontend)

mvn clean install -DskipTests

## Running the app

cd backend\target
vi agens-browser.config.yml
```
## Edit information for connecting AgensGraph DB
spring:
  datasource:
    url: jdbc:postgresql://<host>:<port>/<db>
    username: <user_id>
    password: <user_pw>
```
java -jar agens-browser-bundle-backend-0.6.3.jar --spring.config.name=agens-browser.config

## Built With

* [Spring Boot](https://projects.spring.io/spring-boot/)
* [Maven](https://maven.apache.org/)
