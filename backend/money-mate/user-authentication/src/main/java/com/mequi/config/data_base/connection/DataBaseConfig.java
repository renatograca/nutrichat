package com.mequi.config.data_base.connection;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.io.InputStream;
import java.util.Properties;
import javax.sql.DataSource;

public class DataBaseConfig {
  public static DataSource getDataSource() {
    final var config = new HikariConfig();
    config.setJdbcUrl("jdbc:postgresql://localhost:5432/user_db");
    config.setUsername("postgres");
    config.setPassword("postgres");
    config.setDriverClassName("org.postgresql.Driver");
    config.setMaximumPoolSize(10);
    return new HikariDataSource(config);
  }
}
