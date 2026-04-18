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
public class BookRequest {
    @NotBlank(message = "* Please enter title")
    @Size(min = 2, max = 200, message = "* Title must be between 2 and 200 characters")
    private String title;

    @NotNull(message = "* Please select author")
    private Long authorId;
}
