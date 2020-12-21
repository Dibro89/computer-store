package store.api.model.projection;

import org.springframework.data.rest.core.config.Projection;
import store.api.model.Order;

import java.util.UUID;

@Projection(name = "order", types = Order.class)
public interface OrderProjection {

    UUID getId();

    UserProjection getUser();

    ComputerProjection getComputer();
}
