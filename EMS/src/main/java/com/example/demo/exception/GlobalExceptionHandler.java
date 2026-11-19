package com.example.demo.exception;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

import javax.naming.AuthenticationException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	
	public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
	    Map<String, String> errors = new HashMap<>();
	    ex.getBindingResult().getAllErrors().forEach((error) -> {
	        String fieldName = ((FieldError) error).getField();
	        String errorMessage = error.getDefaultMessage();
	        errors.put(fieldName, errorMessage);
	    });
	    return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleResourceNotFoundException(ResourceNotFoundException ex) {
	    Map<String, String> error = new HashMap<>();
	    error.put("error", ex.getMessage());
	    return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}
	
	
	@ExceptionHandler(DataIntegrityViolationException.class)
	  public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(
		      DataIntegrityViolationException ex) {

		    Map<String, String> error = new HashMap<>();
		    error.put("message", "Data integrity violation: invalid reference or duplicate value");

		    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
		  }
	
	 @ExceptionHandler(HttpMessageNotReadableException.class)
	  public ResponseEntity<Map<String, String>> handleMalformedJson(
	      HttpMessageNotReadableException ex) {

	    Map<String, String> error = new HashMap<>();
	    error.put("message", "Malformed JSON request");

	    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	  }

	 @ExceptionHandler(AccessDeniedException.class)
	  public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {

	    Map<String, String> error = new HashMap<>();
	    error.put("message", "Access denied");

	    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
	  }
	 
	 @ExceptionHandler(AuthenticationException.class)
	  public ResponseEntity<Map<String, String>> handleAuthentication(AuthenticationException ex) {

	    Map<String, String> error = new HashMap<>();
	    error.put("message", "Authentication required");

	    return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
	  }

//	 @ExceptionHandler(PasskeyException.class)
//	  public ResponseEntity<Map<String, String>> handlePasskeyException(PasskeyException ex) {
//
//	    Map<String, String> error = new HashMap<>();
//	    error.put("message", ex.getMessage());
//
//	    return new ResponseEntity<>(error, ex.getStatus());
//	  }
	 
	 
	  @ExceptionHandler(Exception.class)
	  public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {

	    Map<String, String> error = new HashMap<>();
	    error.put("message", "An unexpected error occurred");

	    return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	  }
}
