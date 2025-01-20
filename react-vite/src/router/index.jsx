import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Cart from '../components/CartPage/Cart';
import ProductReviews from '../components/Review/ShowReview'
import Favorites from '../components/Favorite/Favorite';
import CreateProductForm from '../components/ManageProduct/CreateProduct'
import ManageProductForm from '../components/ManageProduct/ManageProduct'
import ShowProductList from '../components/ShowProductList/ShowProductlist'
import SearchResultPage from '../components/SearchBar/SearchResultPage';
import CategoryProductPage from '../components/SearchCategory/CategoryProduct';
import ShowProductDetails from '../components/ShowProductDetail/ShowProductDetail';
import UserProfile from '../components/UserProfile/UserProfile';

import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ShowProductList />,
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
        path:"cart",
        element: <Cart />
      },
      {
        path:"testreview",
        element: <ProductReviews />
      },
      {
        path:"favorites",
        element: <Favorites />
      },
      {
        path:"products/:productId/update",
        element: <ManageProductForm />
      },
      {
        path:"products/create",
        element: <CreateProductForm />
      },
      {
        path:"searchres",
        element: <SearchResultPage />
      },
      {
        path:"/category/:categoryId",
        element: <CategoryProductPage />
      },
      {
        path:"/products/:productId",
        element: <ShowProductDetails />
      },
      {
        path:"/userhome",
        element: <UserProfile />
      }
    ],
  },
]);