package com.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.dto.EmployeeRequestDto;
import com.example.demo.dto.EmployeeResponseDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Department;
import com.example.demo.model.Employee;
import com.example.demo.service.DepartmentService;
import com.example.demo.service.EmployeeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")

@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Employee APIs", description = "API Operations related to managing employees")
public class EmployeeController {
	
	@Autowired
	private EmployeeService employeeService;
	
	@Autowired
	private DepartmentService departmentService;
	
	@Operation(summary = "Get all employees", description = "Retrieve a list of all employees")
	@GetMapping
	public List<EmployeeResponseDto> getAllEmployees() {
		return employeeService.getAllEmployees().stream()
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	@Operation(summary = "Get employee by ID", description = "Retrieve a specific employee by their ID")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Employee found"),
			@ApiResponse(responseCode = "404", description = "Employee not found")
	})
	
	
	@GetMapping("/{id}")
	public ResponseEntity<EmployeeResponseDto> getEmployeeById(@PathVariable Long id) {
		Employee employee = employeeService.getEmployeeById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

		return ResponseEntity.ok(convertToDto(employee));
	}
	
	@Operation(summary = "Create a new employee", description = "Create a new employee record")
	
	
	
	@PostMapping
	public ResponseEntity<EmployeeResponseDto> createEmployee(
			@Valid @RequestBody EmployeeRequestDto request) {
		
		Employee employee = convertToEntity(request);
		Employee savedEmployee = employeeService.saveEmployee(employee);
		
		return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
				.body(convertToDto(savedEmployee));
	}
	
	@Operation(summary = "Update an existing employee", description = "Update an existing employee's details")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Employee updated"),
			@ApiResponse(responseCode = "404", description = "Employee not found")
			
			
	})
	
	
	
	@PutMapping("/{id}")
	public ResponseEntity<EmployeeResponseDto> updateEmployee(
			@PathVariable Long id,
			@Valid @RequestBody EmployeeRequestDto request) {
		
		Employee employee = employeeService.getEmployeeById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

		Department department = departmentService
				.getDepartmentById(request.getDepartment().getId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Department not found with id: " + request.getDepartment().getId()));

		employee.setFirstName(request.getFirstName());
		employee.setLastName(request.getLastName());
		employee.setEmail(request.getEmail());
		employee.setDepartment(department);
		employee.setAge(request.getAge());

		Employee updatedEmployee = employeeService.saveEmployee(employee);

		return ResponseEntity.ok(convertToDto(updatedEmployee));
	}
	
	@Operation(summary = "Delete an employee", description = "Delete an employee record by ID")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "204", description = "Employee deleted"),
			@ApiResponse(responseCode = "404", description = "Employee not found")
	})
	
	
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
		
		employeeService.getEmployeeById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

		employeeService.deleteEmployee(id);
		
		return ResponseEntity.noContent().build();
	}
	
	private EmployeeResponseDto convertToDto(Employee employee) {
		EmployeeResponseDto dto = new EmployeeResponseDto();
		dto.setId(employee.getId());
		dto.setFirstName(employee.getFirstName());
		dto.setLastName(employee.getLastName());
		dto.setEmail(employee.getEmail());
		dto.setAge(employee.getAge());

		if (employee.getDepartment() != null) {
			EmployeeResponseDto.DepartmentDto deptDto = new EmployeeResponseDto.DepartmentDto();
			deptDto.setId(employee.getDepartment().getId());
			deptDto.setName(employee.getDepartment().getName());
			dto.setDepartment(deptDto);
		}

		return dto;
	}
	
	private Employee convertToEntity(EmployeeRequestDto request) {
		Employee employee = new Employee();
		employee.setFirstName(request.getFirstName());
		employee.setLastName(request.getLastName());
		employee.setEmail(request.getEmail());
		employee.setAge(request.getAge());

		Department department = departmentService
				.getDepartmentById(request.getDepartment().getId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Department not found with id: " + request.getDepartment().getId()));

		employee.setDepartment(department);

		return employee;
	}
}