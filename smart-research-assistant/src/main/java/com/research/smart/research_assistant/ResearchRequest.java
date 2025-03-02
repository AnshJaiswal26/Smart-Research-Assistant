package com.research.smart.research_assistant;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResearchRequest {
    private String content;
    private String operation;
}
