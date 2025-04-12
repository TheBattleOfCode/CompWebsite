package com.comp.web;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.comp.web.repository")
@ComponentScan(basePackages = {
    "com.comp.web.config",
    "com.comp.web.controller",
    "com.comp.web.exception",
    "com.comp.web.model",
    "com.comp.web.repository",
    "com.comp.web.security",
    "com.comp.web.service"
})
public class SpringBootApp {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootApp.class, args);
    }
}
