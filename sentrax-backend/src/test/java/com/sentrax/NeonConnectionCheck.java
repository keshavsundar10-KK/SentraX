
package com.sentrax;

import java.sql.Connection;
import java.sql.DriverManager;

public class NeonConnectionCheck {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://ep-empty-dew-b3x2rvci-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
        String user = "neondb_owner";
        String password = System.getenv("DATABASE_PASSWORD");

        if (password == null || password.isBlank()) {
            System.err.println("DATABASE_PASSWORD is missing.");
            System.exit(1);
        }

        try (Connection connection =
                 DriverManager.getConnection(url, user, password)) {
            System.out.println("SUCCESS: Connected to Neon!");
            System.out.println("Database: " + connection.getCatalog());
        } catch (Exception e) {
            System.err.println("Connection failed: " + e.getMessage());
            System.exit(1);
        }
    }
}
