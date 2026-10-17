package com.mequi.config;

import java.io.InputStream;
import java.util.Properties;

public class AppConfig {
  private static final Properties props = new Properties();

  static {
    try (InputStream is = AppConfig.class.getClassLoader().getResourceAsStream("application.yml")) {
      if (is != null) {
        // Simple YAML flat parser for top-level/nested scalar values
        String current = "";
        for (String line : new String(is.readAllBytes()).split("\n")) {
          String trimmed = line.trim();
          if (trimmed.isEmpty() || trimmed.startsWith("#")) continue;
          if (!line.startsWith(" ") && trimmed.endsWith(":")) {
            current = trimmed.substring(0, trimmed.length() - 1);
            continue;
          }
          if (trimmed.contains(":")) {
            String[] parts = trimmed.split(":", 2);
            String key = current.isEmpty() ? parts[0].trim() : current + "." + parts[0].trim();
            String val = parts[1].trim();
            props.setProperty(key, val);
          }
        }
      }
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public static String get(String key) {
    return props.getProperty(key);
  }
}
