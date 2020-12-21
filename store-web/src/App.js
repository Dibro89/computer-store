import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, ListGroup, ListGroupItem, Nav, Navbar, Row, Table } from 'react-bootstrap';
import { Link, Route, Switch, useHistory } from 'react-router-dom';

const API_BASE = 'http://localhost:8080'

async function apiFetch(url, body = null) {
  const resp = await fetch(`${API_BASE}${url}`, {
    ...(body && {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  });
  const json = await resp.json();
  return json;
}

function Home() {
  const [category, setCategory] = useState('server');

  return (
    <div className="my-3">
      <Nav variant="pills" activeKey={category} onSelect={setCategory}>
        <Nav.Link eventKey="server">Сервера</Nav.Link>
        <Nav.Link eventKey="desktop">Настольные</Nav.Link>
        <Nav.Link eventKey="laptop">Портативные</Nav.Link>
      </Nav>
      <Category category={category} />
    </div>
  );
}

function Category(props) {
  const [computers, setComputers] = useState([]);

  useEffect(() => {
    async function fetchComputers() {
      const resp = await apiFetch(`/computers/search/findAllByCategory?projection=computer&category=${props.category}`);
      console.log(resp._embedded.computers);
      setComputers(resp._embedded.computers);
    }

    fetchComputers();
  }, [props.category]);

  return (
    <Row>
      {computers.map(computer => (
        <Col md="4" key={computer.id} className="mt-3">
          <Computer computer={computer} />
        </Col>
      ))}
    </Row>
  );
}

function Computer(props) {
  const computer = props.computer;
  const linkState = { cpu: computer.cpu, gpu: computer.gpu, ram: computer.ram };

  return (
    <Card>
      <Card.Body>
        <Card.Title>{computer.name}</Card.Title>
        {computer.description && (<Card.Text>{computer.description}</Card.Text>)}
        <Card.Link as={Link} to={{ pathname: '/cart', state: linkState }}>Выбрать</Card.Link>
      </Card.Body>
      <ListGroup variant="flush">
        <ListGroupItem>CPU: {computer.cpu.name}</ListGroupItem>
        <ListGroupItem>GPU: {computer.gpu.name}</ListGroupItem>
        <ListGroupItem>RAM: {computer.ram.name}</ListGroupItem>
      </ListGroup>
    </Card>
  );
}

function Create() {
  const [components, setComponents] = useState({ cpu: [], gpu: [], ram: [] });
  const [selectedCpuIndex, setSelectedCpuIndex] = useState(0);
  const [selectedGpuIndex, setSelectedGpuIndex] = useState(0);
  const [selectedRamIndex, setSelectedRamIndex] = useState(0);

  const selectedCpu = components.cpu[selectedCpuIndex];
  const selectedGpu = components.gpu[selectedGpuIndex];
  const selectedRam = components.ram[selectedRamIndex];

  const selectedComponents = [selectedCpu, selectedGpu, selectedRam].filter(Boolean);

  const linkState = { cpu: selectedCpu, gpu: selectedGpu, ram: selectedRam };

  useEffect(() => {
    async function fetchComponents() {
      function groupBy(xs, key) {
        return xs.reduce((rv, x) => {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      }

      const resp = await apiFetch('/components');
      const components = groupBy(resp._embedded.components, 'type');
      setComponents(components);
    }

    fetchComponents();
  }, []);

  return (
    <Row className="my-3">
      <Col md="6" className="mx-auto">
        <h4>Соберите свой комьютер</h4>
        <Form>
          <Form.Group>
            <Form.Label>Выберите процессор:</Form.Label>
            <Form.Control as="select" value={selectedCpuIndex} onChange={e => setSelectedCpuIndex(e.target.value)}>
              {components.cpu.map((component, index) => (
                <option key={component.id} value={index}>{component.name}</option>
              ))}
            </Form.Control>
            <p>Цена: {selectedCpu && selectedCpu.price}</p>
          </Form.Group>
          <Form.Group>
            <Form.Label>Выберите видеокарту:</Form.Label>
            <Form.Control as="select" value={selectedGpuIndex} onChange={e => setSelectedGpuIndex(e.target.value)}>
              {components.gpu.map((component, index) => (
                <option key={component.id} value={index}>{component.name}</option>
              ))}
            </Form.Control>
            <p>Цена: {selectedGpu && selectedGpu.price}</p>
          </Form.Group>
          <Form.Group>
            <Form.Label>Выберите память:</Form.Label>
            <Form.Control as="select" value={selectedRamIndex} onChange={e => setSelectedRamIndex(e.target.value)}>
              {components.ram.map((component, index) => (
                <option key={component.id} value={index}>{component.name}</option>
              ))}
            </Form.Control>
            <p>Цена: {selectedRam && selectedRam.price}</p>
          </Form.Group>
          <p>Общая стоимость: {selectedComponents.reduce((a, b) => a + b.price, 0)} грн</p>
          <Button as={Link} to={{ pathname: '/cart', state: linkState }}>Оформить заказ</Button>
        </Form>
      </Col>
    </Row>
  );
}

function Cart(props) {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const history = useHistory();

  const components = props.location.state;

  if (!components) {
    return null;
  }

  const selectedComponents = Object.values(components);

  async function onSubmit(e) {
    e.preventDefault();

    const user = await apiFetch('/users', { address, phone });
    const computer = await apiFetch('/computers', {
      cpu: components.cpu._links.self.href.replace('{?projection}', ''),
      gpu: components.gpu._links.self.href.replace('{?projection}', ''),
      ram: components.ram._links.self.href.replace('{?projection}', ''),
    });

    await apiFetch('/orders?projection=order', {
      user: user._links.self.href,
      computer: computer._links.self.href,
    });

    history.push('/orders');
  }

  return (
    <Row className="my-3">
      <Col md="6" className="mx-auto">
        <h4>Ваш заказ:</h4>
        <ListGroup className="mt-3">
          <ListGroupItem>Процессор: {components.cpu.name}</ListGroupItem>
          <ListGroupItem>Видеокарта: {components.gpu.name}</ListGroupItem>
          <ListGroupItem>Память: {components.ram.name}</ListGroupItem>
        </ListGroup>
        <Form className="mt-3" onSubmit={onSubmit}>
          <Form.Group controlId="formAddress">
            <Form.Label>Введите адрес доставки:</Form.Label>
            <Form.Control type="text" required value={address} onChange={e => setAddress(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Введите телефон:</Form.Label>
            <Form.Control type="text" required value={phone} onChange={e => setPhone(e.target.value)} />
          </Form.Group>
          <p>К оплате: <span className="font-weight-bold">{selectedComponents.reduce((a, b) => a + b.price, 0)} грн</span></p>
          <Button type="submit">Подтвердить</Button>
        </Form>
      </Col>
    </Row>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const resp = await apiFetch('/orders?projection=order');
      setOrders(resp._embedded.orders);
    }

    fetchOrders();
  }, []);

  return (
    <Table striped bordered className="my-3">
      <thead>
        <tr>
          <th>Адрес</th>
          <th>Телефон</th>
          <th>Процессор</th>
          <th>Видеокарта</th>
          <th>Память</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr>
            <td>{order.user.address}</td>
            <td>{order.user.phone}</td>
            <td>{order.computer.cpu.name}</td>
            <td>{order.computer.gpu.name}</td>
            <td>{order.computer.ram.name}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function App() {
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/">Computer Store</Navbar.Brand>
        <Nav>
          <Nav.Link as={Link} to="/create">Собрать компьютер</Nav.Link>
          <Nav.Link as={Link} to="/orders">Заказы</Nav.Link>
        </Nav>
      </Navbar>
      <Container>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/cart" component={Cart} />
          <Route exact path="/orders" component={Orders} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
