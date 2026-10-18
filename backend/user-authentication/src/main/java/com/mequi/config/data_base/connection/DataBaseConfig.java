package com.mequi.config.data_base.connection;

import com.google.inject.Singleton;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;

@Singleton 
public class DataBaseConfig {
  private static HikariDataSource dataSource;

  public static DataSource getDataSource() {
    if (dataSource == null) {
      HikariConfig config = new HikariConfig();

      var properties = properties();

      config.setJdbcUrl("jdbc:" + properties.dbUrl);
      config.setUsername(properties.dbUser);
      config.setPassword(properties.dbPass);

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

  private static PropertiesDB properties() {
    var dbUrl = System.getenv("DATABASE_URL") != null ? System.getenv("DATABASE_URL") : "postgresql://localhost:5432/users_db";
    var dbUser = System.getenv("DB_USER") != null ? System.getenv("DB_USER") : "postgres";
    var dbPass = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : "postgres";
    return new PropertiesDB(dbUrl, dbUser, dbPass);
  }
}
