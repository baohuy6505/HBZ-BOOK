package com.haibazo.bookreview.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorRequest {
    @NotBlank(message = "* Please enter name")
    @Size(min = 2, max = 100, message = "* Name must be between 2 and 100 characters")
    private String name;
}
