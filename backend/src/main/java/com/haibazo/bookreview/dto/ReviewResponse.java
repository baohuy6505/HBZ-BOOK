package com.haibazo.bookreview.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long id;
    private String bookTitle;
    private String authorName;
    private String content;
    private Long bookId;
}
