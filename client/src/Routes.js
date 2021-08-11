import React, { useState, useEffect } from 'react';
import {
  Switch,
  // Route,
  useLocation
} from "react-router-dom";
import { SmallBanner, SearchNavbar, MainNavbar, IconBanner, Footer } from './components';
// import { Home, Brands, Product, Category, AllProducts } from './pages';
// import { ComingSoon } from './pages';
// import { Dashboard } from './dashboard';
import CartContext from './contexts/cart';
// import DiscountContext from './contexts/discount';
// import api from './api';
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";
//   import './App.scss';
// import './Form.scss';
import './global.scss';
// import Auth from './auth/Auth';

function Routes(props) {
  const [cart, setCart] = useState({ data: {}, count: 0 });
  // const [discountState, setDiscountState] = useState(null);
  let location = useLocation();

  useEffect(() => {
    (
      async () => {
        //         const response = await fetch(`${api}/cart/getCart`, {
        //           method: 'GET',
        //           headers: {
        //             'Content-Type': 'application/json',
        //           },
        //           credentials: 'include',
        //           withCredentials: true,
        //         });
        //         const content = await response.json();
        //         setCart(content.data);
      })();
  }, []);

  //   useEffect(() => {
  //     (
  //       async () => {
  //         const response = await fetch(`${api}/discounts/get-discount`, {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           credentials: 'include',
  //           withCredentials: true,
  //         });
  //         const content = await response.json();
  //         setDiscountState(content.data);
  //       })();
  //   }, []);

  return (
    <CartContext.Provider value={{ cartObj: cart, setCart: setCart }}>
      {/* <DiscountContext.Provider value={discountState}> */}
      <SmallBanner />
      <div className="margin-global-top-1" />
      <SearchNavbar />
      {/* <div className="margin-global-top-1" /> */}
      <MainNavbar />
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          classNames="page"
          timeout={300}
        >
          <div className="page">
            <Switch location={location}>
              {/* <Route path="/__/auth/action">
                  <Auth />
                </Route> */}
              {/* <Route path="/forgot-password/sent" children={
                  <ConfirmationMessage
                    first=""
                    bold="Password Reset"
                    second=""
                  />
                } />
                <Route path="/logout" children={
                  <ConfirmationMessage
                    first=""
                    bold="Account Authentication"
                    second=""
                  />
                } />
                <Route path="/account-creation" children={
                  <ConfirmationMessage
                    first=""
                    bold="Account creation"
                    second=""
                  />
                } />
                <Route path="/email-verification" children={
                  <ConfirmationMessage
                    first=""
                    bold="Email verification"
                    second=""
                  />
                } /> */}
              {/* <Route path="/product/:productSlug" children={<Product />} />
              <Route path="/:category/:subcategory/:subsubcategory" children={<AllProducts />} />
              <Route path="/:category/:productCategory" children={<AllProducts />} />
              <Route path="/brands" children={<Brands />} />
              <Route path="/:category" children={<Category />} /> */}
              {/* <Route path="/" children={<ComingSoon />} /> */}
              {/* <Route path="/" children={<Home />} /> */}
            </Switch>
            <div className="margin-global-top-8" />
            <IconBanner />
            <Footer />
          </div>
        </CSSTransition>
      </TransitionGroup>
      {/* </DiscountContext.Provider> */}
    </CartContext.Provider>
  );
}

export default Routes;