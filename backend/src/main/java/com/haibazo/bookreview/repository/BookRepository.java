package com.haibazo.bookreview.repository;

import com.haibazo.bookreview.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query; // QUAN TRỌNG: Phải có import này
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // Bắt buộc phải có @Query để Spring không tự chế tên hàm
    @EntityGraph(attributePaths = {"author"})
    @Query("SELECT b FROM Book b") 
    Page<Book> findAllWithAuthor(Pageable pageable);
}