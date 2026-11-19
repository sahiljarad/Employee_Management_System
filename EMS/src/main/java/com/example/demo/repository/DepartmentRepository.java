package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
	  @Query("SELECT DISTINCT d FROM Department d LEFT JOIN FETCH d.employees")
	  List<Department> findAllWithEmployees();
	  
	  @Query("SELECT d FROM Department d LEFT JOIN FETCH d.employees WHERE d.id = :id")
	  Optional<Department> findByIdWithEmployees(Long id);
}
