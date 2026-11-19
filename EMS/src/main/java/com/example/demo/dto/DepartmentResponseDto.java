package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DepartmentResponseDto {

	
	private Long id;
	private String name;
	private int employeeCount;
}
