import Header from './Components/Header'
import Footer from './Components/Footer'
import { Container } from 'react-bootstrap'
import HomeScreen from './Screens/HomeScreen'
import ProductScreen from './Screens/ProductScreen'
import { BrowserRouter as Router ,Route,Routes } from 'react-router-dom'
import CartScreen from './Screens/CartScreen'
import LoginScreen from './Screens/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen'
import ProfileScreen from './Screens/ProfileScreen'
import ShippingScreen from './Screens/ShippingScreen'
import PaymentScreen from './Screens/PaymentScreen'
import PlaceOrderScreen from './Screens/PlaceOrderScreen'
import OrderScreen from './Screens/OrderScreen'
import cartImage from './Screens/cartImage'

function App() {
  return (
    <Router>
      <Header />
      <main className='PY-3'>
        <Container>
          <Routes>
            <Route path='/' Component={HomeScreen} exact />
            <Route path='/product/:id' Component={ProductScreen} exact/>
            <Route path='/cart/:id' Component={CartScreen} />
            <Route path='/cart' Component={cartImage} />
            <Route path='/login' Component={LoginScreen} />
            <Route path='/register' Component={RegisterScreen} />
            <Route path='/profile' Component={ProfileScreen} />
            <Route path='/shipping' Component={ShippingScreen} />
            <Route path='/payment' Component={PaymentScreen} />
            <Route path='/placeorder' Component={PlaceOrderScreen} />
            <Route path='/order/:id' Component={OrderScreen} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
