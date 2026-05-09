package com.moneymanager.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        // Convert postgresql:// to jdbc:postgresql://
        String jdbcUrl = "jdbc:" + databaseUrl;

        config.setJdbcUrl(jdbcUrl);
        config.setMaximumPoolSize(3);
        config.setMinimumIdle(1);
        config.setConnectionTimeout(30000);

        return new HikariDataSource(config);
    }
}
