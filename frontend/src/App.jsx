import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import LoginPage from './Pages/LoginPage/LoginPage';
import ShortenUrl from './Pages/ShortenUrl/ShortenUrl';
import MyUrls from './Pages/MyURLs/MyUrls';
import Profile from './Components/Profile/Profile';
import './index.css';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import { HeaderMegaMenu } from './Components/Navbar/HeaderMegaMenu';


function App() {
  return (
    <Router>
        <HeaderMegaMenu/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/shorten' element={<ShortenUrl/>} />
            <Route path='/myurls' element={<MyUrls/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/login' element={<LoginPage/>} />
            <Route element={<PrivateRoute/>}>

            </Route>
        </Routes>
    </Router>
  )
}

export default App
