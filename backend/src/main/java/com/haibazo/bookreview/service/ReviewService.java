package com.haibazo.bookreview.service;

import com.haibazo.bookreview.dto.*;
import com.haibazo.bookreview.entity.*;
import com.haibazo.bookreview.exception.ResourceNotFoundException;
import com.haibazo.bookreview.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Review> pageResult = reviewRepository.findAllWithBookAndAuthor(pageable);

        var content = pageResult.getContent().stream()
                .map(this::toResponse)
                .toList();

        return PageResponse.<ReviewResponse>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public ReviewResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public ReviewResponse create(ReviewRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        Review review = Review.builder()
                .book(book)
                .content(request.getContent())
                .build();
        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse update(Long id, ReviewRequest request) {
        Review review = findById(id);
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        review.setBook(book);
        review.setContent(request.getContent());
        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public void delete(Long id) {
        reviewRepository.delete(findById(id));
    }

    private Review findById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
    }

    private ReviewResponse toResponse(Review review) {
        Book book = review.getBook();
        return ReviewResponse.builder()
                .id(review.getId())
                .content(review.getContent())
                .bookTitle(book.getTitle())
                .authorName(book.getAuthor().getName())
                .bookId(book.getId())
                .build();
    }
}
