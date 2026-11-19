package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
public class DepartmentRequestDto {
	@NotBlank(message = "Department name is required")
	private String name;
	

}
