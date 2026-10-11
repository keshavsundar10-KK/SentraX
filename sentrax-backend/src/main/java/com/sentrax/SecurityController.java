package com.sentrax;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/security")
public class SecurityController {

    private final TaskRepository taskRepository;
    private final SecurityEventRepository eventRepository;

    public SecurityController(
            TaskRepository taskRepository,
            SecurityEventRepository eventRepository) {
        this.taskRepository = taskRepository;
        this.eventRepository = eventRepository;
    }

    public record EvaluateRequest(Long taskId, String proposedAction) {}

    public record EvaluationResponse(
            Long taskId,
            String decision,
            int riskScore,
            String reason,
            String proposedAction) {}

    @PostMapping("/evaluate")
    public EvaluationResponse evaluate(
            @RequestBody EvaluateRequest request) {

        if (request.taskId() == null
                || request.proposedAction() == null
                || request.proposedAction().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "taskId and proposedAction are required");
        }

        if (request.proposedAction().length() > 10000) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Proposed action must be 10000 characters or fewer");
        }

        Task task = taskRepository.findById(request.taskId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Task not found"));

        String action = request.proposedAction()
            .toLowerCase(Locale.ROOT);

        String decision = "ALLOW";
        int riskScore = 10;
        String reason = "No configured high-risk rule was triggered.";

        if (containsAny(action,
                "ignore previous instructions",
                "ignore all instructions",
                "reveal the system prompt",
                "show the system prompt",
                "steal credentials",
                "exfiltrate data",
                "send passwords",
                "disable security")) {

            decision = "BLOCK";
            riskScore = 100;
            reason = "Potential prompt injection or sensitive-data exposure.";

        } else if (containsAny(action,
                "delete all files",
                "drop database",
                "wipe the database",
                "transfer funds",
                "transfer money",
                "make a payment")) {

            decision = "BLOCK";
            riskScore = 90;
            reason = "Potentially destructive or high-impact action.";

        } else if (containsAny(action,
                "send email",
                "send an email",
                "publish",
                "upload",
                "purchase",
                "buy ",
                "delete ",
                "transfer ",
                "share externally")) {

            decision = "FLAG";
            riskScore = 60;
            reason = "Action has a potential external side effect and needs review.";
        }

        SecurityEvent event = new SecurityEvent(
            task.getId(),
            decision,
            riskScore,
            reason,
            request.proposedAction()
        );

        eventRepository.save(event);

        return new EvaluationResponse(
            task.getId(),
            decision,
            riskScore,
            reason,
            request.proposedAction()
        );
    }

    @GetMapping("/events")
    public List<SecurityEvent> getEvents() {
        return eventRepository.findAllByOrderByCreatedAtDesc();
    }

    private boolean containsAny(String text, String... phrases) {
        for (String phrase : phrases) {
            if (text.contains(phrase)) {
                return true;
            }
        }
        return false;
    }
}