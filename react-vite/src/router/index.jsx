import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import AiAssistant from '../components/AiAssiatant/AiAssistant';
import Cart from '../components/CartPage/Cart';
import ProductReviews from '../components/Review/ShowReview'
import Favorites from '../components/Favorite/Favorite';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path:"testcart",
        element: <Cart />
      },
      {
        path:"testreview",
        element: <ProductReviews />
      },
      {
        path:"testfav",
        element: <Favorites />
      }
    ],
  },
]);