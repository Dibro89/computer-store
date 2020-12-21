package store.api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;
import store.api.model.Component;
import store.api.model.Computer;
import store.api.model.Order;
import store.api.model.User;
import store.api.repository.ComponentRepository;
import store.api.repository.ComputerRepository;
import store.api.repository.OrderRepository;
import store.api.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializerService implements ApplicationRunner {

    private final ComponentRepository componentRepository;

    private final ComputerRepository computerRepository;

    private final UserRepository userRepository;

    private final OrderRepository orderRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        List<Component> cpus = componentRepository.saveAll(List.of(
                Component.builder().type("cpu").price(4000).name("Intel Core i3").build(),
                Component.builder().type("cpu").price(6000).name("Intel Core i5").build(),
                Component.builder().type("cpu").price(11000).name("Intel Core i7").build(),
                Component.builder().type("cpu").price(3500).name("AMD Ryzen 3").build(),
                Component.builder().type("cpu").price(7000).name("AMD Ryzen 5").build(),
                Component.builder().type("cpu").price(10000).name("AMD Ryzen 7").build()
        ));

        List<Component> gpus = componentRepository.saveAll(List.of(
                Component.builder().type("gpu").price(12000).name("Nvidia RTX 2060").build(),
                Component.builder().type("gpu").price(16000).name("Nvidia RTX 2070").build(),
                Component.builder().type("gpu").price(20000).name("Nvidia RTX 2080").build(),
                Component.builder().type("gpu").price(6000).name("AMD RX 560").build(),
                Component.builder().type("gpu").price(8000).name("AMD RX 570").build(),
                Component.builder().type("gpu").price(10000).name("AMD RX 580").build()
        ));

        List<Component> rams = componentRepository.saveAll(List.of(
                Component.builder().type("ram").price(700).name("HyperX Fury 4GB").build(),
                Component.builder().type("ram").price(1100).name("HyperX Fury 8GB").build(),
                Component.builder().type("ram").price(2500).name("HyperX Fury 16GB").build(),
                Component.builder().type("ram").price(1200).name("Corsair Vengeance 4GB").build(),
                Component.builder().type("ram").price(2100).name("Corsair Vengeance 8GB").build(),
                Component.builder().type("ram").price(3500).name("Corsair Vengeance 16GB").build()
        ));

        List<Computer> computers = computerRepository.saveAll(List.of(
                Computer.builder().category("server")
                        .name("XXX Server 1000")
                        .description("Best server solution")
                        .cpu(cpus.get(1))
                        .gpu(gpus.get(4))
                        .ram(rams.get(2))
                        .build(),
                Computer.builder().category("desktop")
                        .name("YYY Desktop 2000")
                        .description("Super desktop solution")
                        .cpu(cpus.get(3))
                        .gpu(gpus.get(1))
                        .ram(rams.get(0))
                        .build(),
                Computer.builder().category("laptop")
                        .name("ZZZ Laptop 3000")
                        .description("Amazing laptop solution")
                        .cpu(cpus.get(2))
                        .gpu(gpus.get(4))
                        .ram(rams.get(5))
                        .build()
        ));

        User user = userRepository.save(User.builder().address("New York").phone("+1234").build());

        orderRepository.save(Order.builder().user(user).computer(computers.get(1)).build());
    }
}
