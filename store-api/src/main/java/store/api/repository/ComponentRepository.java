package store.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import store.api.model.Component;

import java.util.UUID;

public interface ComponentRepository extends JpaRepository<Component, UUID> {
}
