package com.haibazo.bookreview.repository;

import com.haibazo.bookreview.entity.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    @Query("SELECT a FROM Author a")
    @EntityGraph(attributePaths = {"books"})
    Page<Author> findAllWithBooks(Pageable pageable);

    @Query("SELECT COUNT(b) FROM Book b WHERE b.author.id = :authorId")
    long countBooksByAuthorId(@Param("authorId") Long authorId);
}