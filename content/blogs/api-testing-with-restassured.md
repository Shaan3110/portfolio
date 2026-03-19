# API Testing with RestAssured: A Practical Guide

RestAssured is a Java library that simplifies testing REST APIs. It provides a domain-specific language (DSL) for writing readable and maintainable API tests.

## Setup

Add RestAssured to your Maven project:

```xml
<dependency>
  <groupId>io.rest-assured</groupId>
  <artifactId>rest-assured</artifactId>
  <version>5.3.0</version>
  <scope>test</scope>
</dependency>
```

## Basic GET Request

```java
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

@Test
public void testGetUsers() {
    given()
        .baseUri("https://api.example.com")
    .when()
        .get("/users")
    .then()
        .statusCode(200)
        .body("size()", greaterThan(0));
}
```

## POST Request with Body

```java
@Test
public void testCreateUser() {
    String requestBody = """
        {
            "name": "Test User",
            "email": "test@example.com"
        }
        """;

    given()
        .contentType(ContentType.JSON)
        .body(requestBody)
    .when()
        .post("/users")
    .then()
        .statusCode(201)
        .body("name", equalTo("Test User"));
}
```

## Integrating with Cucumber

RestAssured pairs well with Cucumber for BDD-style API testing:

```java
@Given("the API is available")
public void apiIsAvailable() {
    given().baseUri(BASE_URL).when().get("/health")
        .then().statusCode(200);
}

@When("I request the user list")
public void requestUserList() {
    response = given().baseUri(BASE_URL).when().get("/users");
}

@Then("I should receive a successful response")
public void verifyResponse() {
    response.then().statusCode(200);
}
```

## Best Practices

- Use base URI configuration to avoid repetition
- Validate response schemas, not just status codes
- Integrate tests into your CI/CD pipeline
- Use data-driven testing for comprehensive coverage

RestAssured makes API testing in Java straightforward and expressive. Combined with TestNG or JUnit, it forms a solid foundation for your API test automation strategy.
