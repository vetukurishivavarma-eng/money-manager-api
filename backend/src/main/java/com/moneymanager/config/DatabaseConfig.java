package com.moneymanager.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() {
        try {
            HikariConfig config = new HikariConfig();

            // Parse the full URL properly
            URI uri = new URI(databaseUrl);

            String host = uri.getHost();
            int port = uri.getPort();
            String database = uri.getPath().replace("/", "");
            String username = uri.getUserInfo().split(":")[0];
            String password = uri.getUserInfo().split(":")[1];

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
