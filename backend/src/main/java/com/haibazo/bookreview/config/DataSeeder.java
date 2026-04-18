package com.haibazo.bookreview.config;

import com.haibazo.bookreview.entity.*;
import com.haibazo.bookreview.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public void run(String... args) {
        if (authorRepository.count() > 0) return;

        Author jackTroute = authorRepository.save(Author.builder().name("Jack Troute").build());
        Author inamori = authorRepository.save(Author.builder().name("Inamori Kazuo").build());
        Author king = authorRepository.save(Author.builder().name("Stephen King").build());
        Author rowling = authorRepository.save(Author.builder().name("J. K. Rowling").build());
        Author brown = authorRepository.save(Author.builder().name("Dan Brown").build());

        Book b1 = bookRepository.save(Book.builder().title("The 22 Immutable Laws of Marketing").author(jackTroute).build());
        Book b2 = bookRepository.save(Book.builder().title("Positioning: The Battle for Your Mind").author(jackTroute).build());
        Book b3 = bookRepository.save(Book.builder().title("Harry Potter and the Philosopher's Stone").author(rowling).build());
        Book b4 = bookRepository.save(Book.builder().title("The Running Grave").author(rowling).build());
        Book b5 = bookRepository.save(Book.builder().title("The Shining").author(king).build());
        Book b6 = bookRepository.save(Book.builder().title("It").author(king).build());
        Book b7 = bookRepository.save(Book.builder().title("The Da Vinci Code").author(brown).build());
        Book b8 = bookRepository.save(Book.builder().title("Amoeba Management").author(inamori).build());

        reviewRepository.saveAll(List.of(
            Review.builder().book(b1).content("Good book!").build(),
            Review.builder().book(b2).content("Very good!").build(),
            Review.builder().book(b3).content("Nice book!").build(),
            Review.builder().book(b4).content("I'm so excited!").build(),
            Review.builder().book(b5).content("I recommend this book!").build(),
            Review.builder().book(b6).content("Masterpiece!").build(),
            Review.builder().book(b7).content("Thrilling read!").build()
        ));
    }
}
