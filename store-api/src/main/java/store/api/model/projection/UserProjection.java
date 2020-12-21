package store.api.model.projection;

import org.springframework.data.rest.core.config.Projection;
import store.api.model.User;

import java.util.UUID;

@Projection(name = "user", types = User.class)
public interface UserProjection {

    UUID getId();

    String getAddress();

    String getPhone();
}
