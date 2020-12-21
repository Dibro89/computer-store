package store.api.model.projection;

import org.springframework.data.rest.core.config.Projection;
import store.api.model.Component;

import java.util.UUID;

@Projection(name = "component", types = Component.class)
public interface ComponentProjection {

    UUID getId();

    String getName();

    String getType();

    double getPrice();
}
