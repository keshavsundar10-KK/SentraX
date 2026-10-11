package com.sentrax;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SecurityEventRepository
        extends JpaRepository<SecurityEvent, Long> {

    List<SecurityEvent> findAllByOrderByCreatedAtDesc();

    long countByDecision(String decision);
}