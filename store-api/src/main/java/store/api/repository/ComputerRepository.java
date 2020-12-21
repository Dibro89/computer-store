package store.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import store.api.model.Computer;

import java.util.List;
import java.util.UUID;

public interface ComputerRepository extends JpaRepository<Computer, UUID> {

    List<Computer> findAllByCategory(String category);
}
