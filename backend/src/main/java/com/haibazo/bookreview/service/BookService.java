package com.haibazo.bookreview.service;

import com.haibazo.bookreview.dto.*;
import com.haibazo.bookreview.entity.*;
import com.haibazo.bookreview.exception.ResourceNotFoundException;
import com.haibazo.bookreview.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    @Transactional(readOnly = true)
    public PageResponse<BookResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Book> pageResult = bookRepository.findAllWithAuthor(pageable);

        var content = pageResult.getContent().stream()
                .map(this::toResponse)
                .toList();

        return PageResponse.<BookResponse>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public BookResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public BookResponse create(BookRequest request) {
        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Author not found"));
        Book book = Book.builder()
                .title(request.getTitle())
                .author(author)
                .build();
        return toResponse(bookRepository.save(book));
    }

    @Transactional
    public BookResponse update(Long id, BookRequest request) {
        Book book = findById(id);
        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Author not found"));
        book.setTitle(request.getTitle());
        book.setAuthor(author);
        return toResponse(bookRepository.save(book));
    }

    @Transactional
    public void delete(Long id) {
        bookRepository.delete(findById(id));
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getAllForDropdown() {
        return bookRepository.findAll(Sort.by("title")).stream()
                .map(this::toResponse)
                .toList();
    }

    private Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    private BookResponse toResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .authorName(book.getAuthor().getName())
                .authorId(book.getAuthor().getId())
                .build();
    }
}
