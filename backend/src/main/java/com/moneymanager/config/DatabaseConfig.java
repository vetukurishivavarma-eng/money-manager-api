package com.moneymanager.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.net.URLDecoder;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() {
        try {
            HikariConfig config = new HikariConfig();

            String url = databaseUrl.trim();

            // Remove protocol prefix
            int authorityStart = url.indexOf("://");
            String authority = url.substring(authorityStart + 3);

            // Split into credentials and rest by the LAST @ before :port pattern
            // The password may contain @, so we look for @ followed by hostname:port
            int lastAtIndex = authority.lastIndexOf("@");
            String credentials = authority.substring(0, lastAtIndex);
            String afterCredentials = authority.substring(lastAtIndex + 1);

            // Split credentials by the first : to get username:password
            int colonIndex = credentials.indexOf(":");
            String username = credentials.substring(0, colonIndex);
            String password = URLDecoder.decode(credentials.substring(colonIndex + 1));

            // Parse host, port, database from after @host:port/db?query
            int dbStart = afterCredentials.indexOf("/");

            String hostPort = afterCredentials.substring(0, dbStart);
            String database = afterCredentials.substring(dbStart + 1);

            int qIdx = database.indexOf("?");
            if (qIdx > 0) {
                database = database.substring(0, qIdx);
            }

            // Parse host and port
            int portSep = hostPort.indexOf(":");
            String host;
            int port;

            if (portSep > 0) {
                host = hostPort.substring(0, portSep);
                port = Integer.parseInt(hostPort.substring(portSep + 1));
            } else {
                host = hostPort;
                port = 5432;
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