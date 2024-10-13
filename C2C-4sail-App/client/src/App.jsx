
import './App.css'
import {Route, Routes} from 'react-router-dom';
import IndexPage from './pages/IndexPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import Layout from './Layout.jsx';
import axios from 'axios'
import { UserContextProvider } from './UserContext.jsx';
import ForSalePage from './pages/ForSalePage.jsx';
import ForSaleFormPage from './pages/ForSaleFormPage.jsx';
import ItemPage from './pages/ItemPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';

axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true;

function App() {

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<IndexPage/>}/>
          <Route path='/login' element={<LoginPage/>}/> 
          <Route path='/register' element={<RegisterPage/>}/> 
          <Route path='/account' element={<AccountPage/>}/> 
          <Route path='/account/forsale' element={<ForSalePage/>}/> 
          <Route path='/account/forsale/new' element={<ForSaleFormPage/>}/> 
          <Route path='/account/forsale/:id' element={<ForSaleFormPage/>}/> 
          <Route path='/account/wishlist' element={<WishlistPage/>}/> 
          <Route path="/item/:id" element={<ItemPage/>}/>
          <Route path="/search/:query" element={<SearchPage/>} /> 
          <Route path="/messages" element={<MessagesPage/>} />
          <Route path="/messages/:id" element={<MessagesPage/>} />
        </Route>  
      </Routes>
    </UserContextProvider>
    
  )
}

export default App

