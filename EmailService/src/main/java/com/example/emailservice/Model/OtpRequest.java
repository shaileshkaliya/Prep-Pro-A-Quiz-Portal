// src/main/java/com/example/emailservice/Model/OtpRequest.java
package com.example.emailservice.Model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Generates getters, setters, toString, equals, and hashCode methods
@NoArgsConstructor // Generates a no-arguments constructor
@AllArgsConstructor // Generates a constructor with all fields as arguments
public class OtpRequest {
    private String email;
}

