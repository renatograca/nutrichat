package com.mequi.config.data_base.connection;

public class PropertiesDB {
    String dbUrl;
    String dbUser;
    String dbPass;
    public PropertiesDB(String dbUrl, String dbUser, String dbPass) {
            super();
            this.dbUrl = dbUrl;
            this.dbUser = dbUser;
            this.dbPass = dbPass;
    }
}
