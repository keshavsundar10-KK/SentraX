package com.sentrax;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/security")
public class SecurityMetricsController {

    private final SecurityEventRepository eventRepository;

    public SecurityMetricsController(
            SecurityEventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public record MetricsResponse(
            long totalEvents,
            long allowCount,
            long flagCount,
            long blockCount) {}

    @GetMapping("/metrics")
    public MetricsResponse getMetrics() {
        long allow = eventRepository.countByDecision("ALLOW");
        long flag = eventRepository.countByDecision("FLAG");
        long block = eventRepository.countByDecision("BLOCK");

        return new MetricsResponse(
            allow + flag + block,
            allow,
            flag,
            block
        );
    }
}