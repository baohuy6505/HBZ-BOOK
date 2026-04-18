package com.haibazo.bookreview.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequest {
    @NotNull(message = "* Please select book")
    private Long bookId;

    @NotBlank(message = "* Please enter content")
    @Size(min = 1, max = 2000, message = "* Content must be between 1 and 2000 characters")
    private String content;
}
