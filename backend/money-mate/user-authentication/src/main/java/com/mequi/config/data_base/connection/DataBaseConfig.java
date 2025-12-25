package com.mequi.config.data_base.connection;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;

public class DataBaseConfig {
  private static HikariDataSource dataSource;

  public static DataSource getDataSource() {
    if (dataSource == null) {
      HikariConfig config = new HikariConfig();

      String dbUrl = System.getenv("DATABASE_URL");

      config.setJdbcUrl("jdbc:" + dbUrl);
      config.setUsername(System.getenv("DB_USER"));
      config.setPassword(System.getenv("DB_PASSWORD"));

      config.setMaximumPoolSize(10);
      config.setMinimumIdle(2);
      config.setConnectionTimeout(30000);
      config.setIdleTimeout(60000);
      config.setMaxLifetime(1800000);

      config.setDriverClassName("org.postgresql.Driver");

      dataSource = new HikariDataSource(config);
    }
    return dataSource;
  }
}
