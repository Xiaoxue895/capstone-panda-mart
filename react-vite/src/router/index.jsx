import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import AiAssistant from '../components/AiAssiatant/AiAssistant';
import Cart from '../components/CartPage/Cart';
import ProductReviews from '../components/Review/ShowReview'
import Favorites from '../components/Favorite/Favorite';
import CreateProductForm from '../components/ManageProduct/CreateProduct'
// import ManageProduct from '../components/ManageProduct/ManageProduct'
// import UpdateProduct from '../components/ManageProduct/UpdateProduct'
import ShowProductList from '../components/ShowProductList/ShowProductlist'
import SearchResultPage from '../components/SearchBar/SearchResultPage';
import CategoryProductPage from '../components/SearchCategory/CategoryProduct';
import ShowProductDetails from '../components/ShowProductDetail/ShowProductDetail';
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
      },
      {
        path:"testcreate",
        element: <CreateProductForm />
      },
      {
        path:"testshowlist",
        element: <ShowProductList />
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
      // {
      //   path:"testupdate",
      //   element: <UpdateProduct />
      // },
      // {
      //   path:"testmanage",
      //   element: <ManageProduct />
      // }
    ],
  },
]);