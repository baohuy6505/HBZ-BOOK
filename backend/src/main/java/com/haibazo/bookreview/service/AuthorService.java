package com.haibazo.bookreview.service;

import com.haibazo.bookreview.dto.*;
import com.haibazo.bookreview.entity.Author;
import com.haibazo.bookreview.exception.ResourceNotFoundException;
import com.haibazo.bookreview.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    @Transactional(readOnly = true)
    public PageResponse<AuthorResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Author> pageResult = authorRepository.findAllWithBooks(pageable);

        var content = pageResult.getContent().stream()
                .map(this::toResponse)
                .toList();

        return PageResponse.<AuthorResponse>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public AuthorResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public AuthorResponse create(AuthorRequest request) {
        if (authorRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("* Author name already exists");
        }
        Author author = Author.builder().name(request.getName()).build();
        author = authorRepository.save(author);
        return toResponseWithCount(author, 0);
    }

    @Transactional
    public AuthorResponse update(Long id, AuthorRequest request) {
        Author author = findById(id);
        if (authorRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new IllegalArgumentException("* Author name already exists");
        }
        author.setName(request.getName());
        author = authorRepository.save(author);
        return toResponseWithCount(author, author.getBookCount());
    }

    @Transactional
    public void delete(Long id) {
        Author author = findById(id);
        authorRepository.delete(author);
    }

    @Transactional(readOnly = true)
    public List<AuthorResponse> getAllForDropdown() {
        return authorRepository.findAll(Sort.by("name")).stream()
                .map(a -> AuthorResponse.builder().id(a.getId()).name(a.getName()).books(0).build())
                .toList();
    }

    private Author findById(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + id));
    }

    private AuthorResponse toResponse(Author author) {
        int bookCount = author.getBooks() != null ? author.getBooks().size() : 0;
        return AuthorResponse.builder()
                .id(author.getId())
                .name(author.getName())
                .books(bookCount)
                .build();
    }

    private AuthorResponse toResponseWithCount(Author author, int bookCount) {
        return AuthorResponse.builder()
                .id(author.getId())
                .name(author.getName())
                .books(bookCount)
                .build();
    }
}
