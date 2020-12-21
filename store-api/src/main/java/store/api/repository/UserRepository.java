package store.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import store.api.model.User;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
}
