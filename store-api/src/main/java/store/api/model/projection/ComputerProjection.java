package store.api.model.projection;

import org.springframework.data.rest.core.config.Projection;
import store.api.model.Computer;

import java.util.UUID;

@Projection(name = "computer", types = Computer.class)
public interface ComputerProjection {

    UUID getId();

    String getName();

    String getDescription();

    String getCategory();

    ComponentProjection getCpu();

    ComponentProjection getGpu();

    ComponentProjection getRam();
}
