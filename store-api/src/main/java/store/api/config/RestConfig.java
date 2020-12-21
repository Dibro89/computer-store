package store.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import store.api.model.Component;
import store.api.model.Computer;
import store.api.model.Order;
import store.api.model.User;

@Configuration
public class RestConfig {

    @Bean
    public RepositoryRestConfigurer restConfigurer() {
        return new RepositoryRestConfigurer() {

            @Override
            public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
                config.exposeIdsFor(Component.class, Computer.class, User.class, Order.class);
                cors.addMapping("/**");
            }
        };
    }
}
