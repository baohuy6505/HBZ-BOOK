package com.haibazo.bookreview.repository;

import com.haibazo.bookreview.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @EntityGraph(attributePaths = {"book", "book.author"})
    @Query("SELECT r FROM Review r")
    Page<Review> findAllWithBookAndAuthor(Pageable pageable);
}