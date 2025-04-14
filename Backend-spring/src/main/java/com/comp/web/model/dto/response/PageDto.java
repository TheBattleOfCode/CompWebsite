package com.comp.web.model.dto.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic DTO for paginated responses
 * @param <T> Type of data, must implement Pageable interface
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageDto<T extends Pageable> {
    
    /**
     * List of data items
     */
    private List<T> data;
    
    /**
     * Total count of all resources (regardless of pagination)
     */
    @JsonProperty("total_count")
    private long totalCount;
    
    /**
     * Additional metadata for the response
     */
    private Object meta;
}
