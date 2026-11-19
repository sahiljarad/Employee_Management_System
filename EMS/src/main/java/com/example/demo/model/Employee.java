package com.example.demo.model;


import com.fasterxml.jackson.annotation.JsonBackReference;


import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@Entity
@AllArgsConstructor
@Table(name="employees")
public class Employee {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message ="First name is required")
	private String firstName;
	
	@NotBlank(message ="Last name is required")
	
	private String lastName;
	
	 @NotBlank(message = "Email is required")
	 @Email(message="Email must be valid")
	private String email;
	 
	 @NotNull(message="Department is required")
	 @ManyToOne(fetch = FetchType.EAGER)
	 @JoinColumn(name = "department_id", nullable = false)
	 @JsonBackReference
	private Department department;
	
	 @Min(value =18, message ="Age must be at least 18")
	 @Max(value = 65, message="Age must be at least 65")
	private int age;

}
