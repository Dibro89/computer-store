package store.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import store.api.model.Order;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
}
