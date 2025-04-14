package com.comp.web.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic DTO for single item responses
 * @param <T> Type of data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SingleResultDto<T> {
    
    /**
     * Single data item
     */
    private T data;
}
