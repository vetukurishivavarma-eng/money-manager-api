package com.moneymanager.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() {
        try {
            HikariConfig config = new HikariConfig();

            // Format: postgresql://username:password@host:port/database?sslmode=require
            String url = databaseUrl.trim();

            // Remove protocol
            int atIndex = url.indexOf("@");
            int colonIndex = url.indexOf(":");
            int slashAfterProtocol = url.indexOf("//");

            String userInfo = url.substring(slashAfterProtocol + 2, atIndex);
            String afterHost = url.substring(atIndex + 1);

            // Parse username and password
            String[] userParts = userInfo.split(":");
            String username = userParts[0];
            String password = URLDecoder.decode(userParts[1], StandardCharsets.UTF_8);

            // Parse host, port, database
            int portSep = afterHost.indexOf(":");
            int dbSep = afterHost.indexOf("/");

            String host;
            int port;
            String database;

            if (portSep > 0 && dbSep > 0) {
                host = afterHost.substring(0, portSep);
                port = Integer.parseInt(afterHost.substring(portSep + 1, dbSep));
                database = afterHost.substring(dbSep + 1);
            } else {
                throw new RuntimeException("Invalid DATABASE_URL format");
            }

            String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s?sslmode=require", host, port, database);

            config.setJdbcUrl(jdbcUrl);
            config.setUsername(username);
            config.setPassword(password);
            config.setMaximumPoolSize(3);
            config.setMinimumIdle(1);
            config.setConnectionTimeout(30000);

            return new HikariDataSource(config);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse DATABASE_URL: " + databaseUrl, e);
        }
    }
}