package com.sentrax;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "security_events")
public class SecurityEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long taskId;

    @Column(nullable = false, length = 20)
    private String decision;

    @Column(nullable = false)
    private int riskScore;

    @Column(nullable = false, length = 1000)
    private String reason;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String proposedAction;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected SecurityEvent() {
    }

    public SecurityEvent(Long taskId, String decision, int riskScore,
                         String reason, String proposedAction) {
        this.taskId = taskId;
        this.decision = decision;
        this.riskScore = riskScore;
        this.reason = reason;
        this.proposedAction = proposedAction;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getTaskId() { return taskId; }
    public String getDecision() { return decision; }
    public int getRiskScore() { return riskScore; }
    public String getReason() { return reason; }
    public String getProposedAction() { return proposedAction; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}