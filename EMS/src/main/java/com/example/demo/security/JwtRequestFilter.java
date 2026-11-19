////package com.example.demo.security;
////
////import java.io.IOException;
////
////import jakarta.servlet.FilterChain;
////import jakarta.servlet.ServletException;
////import jakarta.servlet.http.HttpServletRequest;
////import jakarta.servlet.http.HttpServletResponse;
////
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
////import org.springframework.security.core.context.SecurityContextHolder;
////import org.springframework.security.core.userdetails.UserDetails;
////import org.springframework.security.core.userdetails.UserDetailsService;
////import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
////import org.springframework.stereotype.Component;
////import org.springframework.web.filter.OncePerRequestFilter;
////
////@Component
////public class JwtRequestFilter extends OncePerRequestFilter {
////
////    @Autowired
////    private JwtTokenUtil jwtTokenUtil;
////
////    @Autowired
////    private UserDetailsService userDetailsService;
////    @Override
////    protected void doFilterInternal(
////            HttpServletRequest request,
////            HttpServletResponse response,
////            FilterChain chain)
////            throws ServletException, IOException {
////
////        System.out.println("===== JWT FILTER =====");
////
////        final String authHeader = request.getHeader("Authorization");
////        System.out.println("Authorization Header : " + authHeader);
////
////        String username = null;
////        String jwt = null;
////
////        if (authHeader != null && authHeader.startsWith("Bearer ")) {
////
////            jwt = authHeader.substring(7);
////
////            try {
////                username = jwtTokenUtil.extractUsername(jwt);
////                System.out.println("Username From Token : " + username);
////
////            } catch (Exception e) {
////                System.out.println("JWT Error : " + e.getMessage());
////                chain.doFilter(request, response);
////                return;
////            }
////        }
////
////        if (username != null &&
////                SecurityContextHolder.getContext().getAuthentication() == null) {
////
////            UserDetails userDetails =
////                    userDetailsService.loadUserByUsername(username);
////
////            if (jwtTokenUtil.validateToken(jwt, userDetails.getUsername())) {
////
////                UsernamePasswordAuthenticationToken authToken =
////                        new UsernamePasswordAuthenticationToken(
////                                userDetails,
////                                null,
////                                userDetails.getAuthorities());
////
////                authToken.setDetails(
////                        new WebAuthenticationDetailsSource().buildDetails(request));
////
////                SecurityContextHolder.getContext().setAuthentication(authToken);
////
////                System.out.println("JWT Authentication Successful");
////            } else {
////                System.out.println("JWT Validation Failed");
////            }
////        }
////
////        chain.doFilter(request, response);
////    
////    }
////}
//
//
//
//package com.example.demo.security;
//
//import java.io.IOException;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//@Component
//public class JwtRequestFilter extends OncePerRequestFilter {
//
//    @Autowired
//    private JwtTokenUtil jwtTokenUtil;
//
//    @Autowired
//    private UserDetailsService userDetailsService;
//
//    @Override
//    protected void doFilterInternal(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            FilterChain chain)
//            throws ServletException, IOException {
//
//        System.out.println("===== JWT FILTER =====");
//
//        final String authHeader =
//                request.getHeader("Authorization");
//
//        System.out.println(
//                "Authorization Header : " + authHeader
//        );
//
//        String username = null;
//        String jwt = null;
//
//        // =========================================
//        // 1. CHECK AUTHORIZATION HEADER
//        // =========================================
//
//        if (authHeader != null &&
//                authHeader.startsWith("Bearer ")) {
//
//            jwt = authHeader.substring(7);
//
//            try {
//
//                username =
//                        jwtTokenUtil.extractUsername(jwt);
//
//                System.out.println(
//                        "Username From Token : " + username
//                );
//
//            } catch (Exception e) {
//
//                System.out.println(
//                        "JWT Error : " + e.getMessage()
//                );
//
//                response.setStatus(
//                        HttpServletResponse.SC_UNAUTHORIZED
//                );
//
//                response.setContentType(
//                        "application/json"
//                );
//
//                response.getWriter().write(
//                        "{\"message\":\"JWT token is expired or invalid\"}"
//                );
//
//                return;
//            }
//        }
//
//        // =========================================
//        // 2. AUTHENTICATE USER
//        // =========================================
//
//        if (username != null &&
//                SecurityContextHolder
//                        .getContext()
//                        .getAuthentication() == null) {
//
//            try {
//
//                UserDetails userDetails =
//                        userDetailsService
//                                .loadUserByUsername(username);
//
//                // =========================================
//                // 3. VALIDATE TOKEN
//                // =========================================
//
//                if (jwtTokenUtil.validateToken(
//                        jwt,
//                        userDetails.getUsername())) {
//
//                    UsernamePasswordAuthenticationToken
//                            authToken =
//                            new UsernamePasswordAuthenticationToken(
//                                    userDetails,
//                                    null,
//                                    userDetails.getAuthorities()
//                            );
//
//                    authToken.setDetails(
//                            new WebAuthenticationDetailsSource()
//                                    .buildDetails(request)
//                    );
//
//                    SecurityContextHolder
//                            .getContext()
//                            .setAuthentication(authToken);
//
//                    System.out.println(
//                            "JWT Authentication Successful"
//                    );
//
//                } else {
//
//                    System.out.println(
//                            "JWT Validation Failed"
//                    );
//
//                    response.setStatus(
//                            HttpServletResponse.SC_UNAUTHORIZED
//                    );
//
//                    response.setContentType(
//                            "application/json"
//                    );
//
//                    response.getWriter().write(
//                            "{\"message\":\"Invalid JWT token\"}"
//                    );
//
//                    return;
//                }
//
//            } catch (UsernameNotFoundException e) {
//
//                System.out.println(
//                        "User not found : " + username
//                );
//
//                response.setStatus(
//                        HttpServletResponse.SC_UNAUTHORIZED
//                );
//
//                response.setContentType(
//                        "application/json"
//                );
//
//                response.getWriter().write(
//                        "{\"message\":\"User not found\"}"
//                );
//
//                return;
//            }
//        }
//
//        // =========================================
//        // 4. CONTINUE REQUEST
//        // =========================================
//
//        chain.doFilter(request, response);
//    }
//}





package com.example.demo.security;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws ServletException, IOException {

        System.out.println("===== JWT FILTER =====");

        String authHeader =
                request.getHeader("Authorization");

        System.out.println(
                "Authorization Header : " + authHeader
        );

        String username = null;
        String jwt = null;

        // =====================================================
        // 1. CHECK AUTHORIZATION HEADER
        // =====================================================

        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            jwt = authHeader.substring(7);

            try {

                username =
                        jwtTokenUtil.extractUsername(jwt);

                System.out.println(
                        "Username From Token : "
                        + username
                );

            } catch (Exception e) {

                System.out.println(
                        "JWT Error : "
                        + e.getMessage()
                );

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.setContentType(
                        "application/json"
                );

                response.getWriter().write(
                        "{\"message\":\"JWT token is expired or invalid. Please login again.\"}"
                );

                return;
            }
        }

        // =====================================================
        // 2. AUTHENTICATE USER
        // =====================================================

        if (username != null &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            try {

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(username);

                // =================================================
                // 3. VALIDATE TOKEN
                // =================================================

                if (jwtTokenUtil.validateToken(
                        jwt,
                        userDetails.getUsername())) {

                    UsernamePasswordAuthenticationToken
                            authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authToken);

                    System.out.println(
                            "JWT Authentication Successful"
                    );

                } else {

                    System.out.println(
                            "JWT Validation Failed"
                    );

                    response.setStatus(
                            HttpServletResponse.SC_UNAUTHORIZED
                    );

                    response.setContentType(
                            "application/json"
                    );

                    response.getWriter().write(
                            "{\"message\":\"Invalid or expired JWT token. Please login again.\"}"
                    );

                    return;
                }

            } catch (UsernameNotFoundException e) {

                System.out.println(
                        "User not found : "
                        + username
                );

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.setContentType(
                        "application/json"
                );

                response.getWriter().write(
                        "{\"message\":\"User not found\"}"
                );

                return;
            }
        }

        // =====================================================
        // 4. CONTINUE REQUEST
        // =====================================================

        chain.doFilter(request, response);
    }
}