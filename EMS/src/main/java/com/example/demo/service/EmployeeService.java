package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
@Service
public class EmployeeService {

	@Autowired
  private EmployeeRepository employeeRepository;
	
	@Autowired
  private EntityManager entityManager;
	
	
	public List<Employee> getAllEmployees() {
		return employeeRepository.findAllWithDepartments();

		
	}
	
	public Optional<Employee> getEmployeeById(Long id) {
		return employeeRepository.findByIdWithDepartment(id);
	}
	
	@Transactional
	public Employee saveEmployee(Employee employee) {
	    Employee saved = employeeRepository.save(employee);
	    entityManager.flush();
	    entityManager.clear();
	    return employeeRepository.findByIdWithDepartment(saved.getId()).orElse(saved);
	}
	
	public void deleteEmployee(Long id) {
		employeeRepository.deleteById(id);
	}
	
}

