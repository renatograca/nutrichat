package com.mequi.config.data_base.connection;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;

public class DataBaseConfig {
  public static DataSource getDataSource() {
    final var config = new HikariConfig();
    config.setJdbcUrl(System.getenv().getOrDefault("DB_URL", "jdbc:postgresql://localhost:5432/user_db"));
    config.setUsername(System.getenv().getOrDefault("DB_USER", "postgres"));
    config.setPassword(System.getenv().getOrDefault("DB_PASSWORD", "postgres"));
    config.setDriverClassName("org.postgresql.Driver");
    config.setMaximumPoolSize(Integer.parseInt(System.getenv().getOrDefault("DB_MAX_POOL_SIZE", "10")));
    return new HikariDataSource(config);
  }
}
