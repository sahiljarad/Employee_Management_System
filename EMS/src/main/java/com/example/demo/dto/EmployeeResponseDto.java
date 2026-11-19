package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EmployeeResponseDto {

	private Long id;
	
	private String firstName;
	private String lastName;
	private String email;
	private int age;
	private DepartmentDto department;
	
	
	@Data
	@NoArgsConstructor
	public static class DepartmentDto{
		private Long id;
		private String name;
	}
}
