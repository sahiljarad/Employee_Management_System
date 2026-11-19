package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Department;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.EmployeeRepository;

@Service
public class DepartmentService {
    
	@Autowired
	private DepartmentRepository departmentRepository;
	
	@Autowired
	private EmployeeRepository employeeRepository;
	
	public List<Department> getAllDepartments() {
		return departmentRepository.findAllWithEmployees();
	}

	public Optional<Department> getDepartmentById(Long id) {
		return departmentRepository.findByIdWithEmployees(id);
	}

	public Department saveDepartment(Department department) {
		return departmentRepository.save(department);
	}
	
	 public long countEmployeesInDepartment(Long departmentId) {
		    return employeeRepository.countByDepartmentId(departmentId);
		  }
	public void deleteDepartment(Long id) {
		departmentRepository.deleteById(id);
	}
	
}
