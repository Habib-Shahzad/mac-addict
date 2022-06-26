import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import { SmallBanner, SearchNavbar, MainNavbar, IconBanner, Footer } from './components';
import { Home, Brands, Product, Category, AllProducts, Signin, Signup, Cart } from './pages';
// import { ComingSoon } from './pages';
import { Dashboard } from './dashboard';
import CartContext from './contexts/cart';
import DiscountContext from './contexts/discount';
import api from './api';
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";
//   import './App.scss';
import './form.scss';
import './global.scss';
// import Auth from './auth/Auth';

function Routes(props) {
  const [cart, setCart] = useState({});
  // const [cart, setCart] = useState({ data: {}, count: 0 });
  const [discountState, setDiscountState] = useState(null);
  const [navOptions, setNavOptions] = useState([]);
  const [mainNavOptions, setMainNavOptions] = useState([]);

  let location = useLocation();

  useEffect(() => {
    (
      async () => {
        setDiscountState(null);
        const response = await fetch(`${api}/category/client-categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          },
          credentials: 'include',
          withCredentials: true,
        });
        const content = await response.json();
        // console.log(content);
        try {
          const data = content.data;
          const options = [
            {
              content: [{ id: 1, name: "Brands", to: "/brands" }]
            },
          ];
          const mainNav = [
            { name: "Brands", to: "/brands" }
          ];
          data.forEach(category => {
            const newCat = {
              hideBorder: false,
              content: [
                {
                  id: category._id,
                  name: category.name,
                }
              ]
            };
            const mainNewCat = {
              name: category.name,
              to: `/${category.slug}`
            }
            if (category.subCategories.length === 0) {
              newCat.content[0]['to'] = `/${category.slug}`;
            } else {
              newCat.content[0]['children'] = [
                {
                  content: [
                    { id: category._id, name: `All ${category.name}`, to: `/${category.slug}` }
                  ]
                }
              ];
              mainNewCat['children'] = [];
              category.subCategories.forEach(subCategory => {
                const newSubCat = {
                  id: subCategory._id,
                  name: subCategory.name,
                }
                const mainNewSubCat = {
                  name: subCategory.name,
                  to: `/${category.slug}/${subCategory.slug}`
                }
                if (subCategory.furtherSubCategories.length === 0) {
                  newSubCat['to'] = `/${category.slug}/${subCategory.slug}`;
                } else {
                  newSubCat['children'] = [
                    {
                      content: [
                        { id: subCategory._id, name: `All ${subCategory.name}`, to: `/${category.slug}/${subCategory.slug}` }
                      ]
                    }
                  ];
                  mainNewSubCat['children'] = [];
                  subCategory.furtherSubCategories.forEach(furtherSubCategory => {
                    const newFurtherSubCat = { id: furtherSubCategory._id, name: furtherSubCategory.name, to: `/${category.slug}/${subCategory.slug}/${furtherSubCategory.slug}` };
                    const mainNewFurtherSubCat = { name: furtherSubCategory.name, to: `/${category.slug}/${subCategory.slug}/${furtherSubCategory.slug}` };
                    newSubCat['children'][0].content.push(newFurtherSubCat);
                    mainNewSubCat['children'].push(mainNewFurtherSubCat);
                  });
                }
                newCat.content[0]['children'][0].content.push(newSubCat);
                mainNewCat['children'].push(mainNewSubCat);
              });
            }
            options.push(newCat);
            mainNav.push(mainNewCat);
          });
          options.push(
            {
              content: [{ id: 2, name: "Pre-Orders", to: "/pre-orders" }]
            }
          );
          options.push(
            {
              content: [{ id: 2, name: "SALE", to: "/sale" }]
            }
          );
          mainNav.push(
            { name: "Pre-Orders", to: "/pre-orders" }
          );
          mainNav.push(
            { name: "SALE", to: "/sale" }
          );
          setNavOptions(options);
          setMainNavOptions(mainNav);
        } catch (error) {
        }
      })();
  }, []);



  useEffect(() => {
    (
      async () => {
        const response = await fetch(`${api}/cart/getCart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          withCredentials: true,
        });
        const content = await response.json();
        setCart(content.data);
      })();
  }, []);


  // const options = [
  // {
  //   content: [{ id: 1, name: "Brands", to: "/brands" }]
  // },
  //   {
  //     hideBorder: false,
  //     content: [
  //       {
  //         id: 2,
  //         name: "Makeup",
  //         children: [
  //           {
  //             content: [
  //               { id: 3, name: "All Makeup", to: "/make-up" },
  //               {
  //                 id: 4,
  //                 name: "Face",
  //                 children: [
  //                   {
  //                     content: [
  //                       { id: 5, name: "All Face", to: "/face" },
  //                       { id: 7, name: "Foundation", to: "/foundation" },
  //                       { id: 8, name: "Foundation", to: "/foundation" },
  //                       { id: 9, name: "Foundation", to: "/foundation" },
  //                       { id: 10, name: "Foundation", to: "/foundation" }
  //                     ]
  //                   }
  //                 ]
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     hideBorder: false,
  //     content: [
  //       {
  //         id: 2,
  //         name: "Makeup",
  //         children: [
  //           {
  //             content: [
  //               { id: 3, name: "All Makeup", to: "/make-up" },
  //               {
  //                 id: 4,
  //                 name: "Face",
  //                 children: [
  //                   {
  //                     content: [
  //                       { id: 5, name: "All Face", to: "/face" },
  //                       { id: 7, name: "Foundation", to: "/foundation" },
  //                       { id: 8, name: "Foundation", to: "/foundation" },
  //                       { id: 9, name: "Foundation", to: "/foundation" },
  //                       { id: 10, name: "Foundation", to: "/foundation" }
  //                     ]
  //                   }
  //                 ]
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ];

  // useEffect(() => {
  //   (
  //     async () => {
  //       const response = await fetch(`${api}/cart/getCart`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         credentials: 'include',
  //         withCredentials: true,
  //       });
  //       const content = await response.json();

  //       const data = {
  //         'product-1': {
  //           item: {
  //             name: 'Cream Lip Stain Liquid Lipstick',
  //             slug: 'product-1',
  //             imagePath: 'https://www.sephora.com/productimages/sku/s1959386-main-zoom.jpg',
  //             active: true,
  //             hasColor: true,
  //             points: 1
  //           }
  //         }
  //       }
  //       setCart(content.data);
  //     })();
  // }, []);

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
      <DiscountContext.Provider value={discountState}>
        <SmallBanner />
        <div className="margin-global-top-1" />
        <SearchNavbar options={navOptions} />
        {/* <div className="margin-global-top-1" /> */}
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
                <Route path="/dashboard">
                  <MainNavbar options={mainNavOptions} />
                  <Dashboard />
                </Route>
                <Route path="/product/:productSlug">
                  <MainNavbar options={mainNavOptions} />
                  <Product />
                </Route>
                <Route path="/:category/:subcategory/:furthersubcategory">
                  <MainNavbar options={mainNavOptions} />
                  <AllProducts />
                </Route>
                <Route path="/:category/:subcategory">
                  <MainNavbar options={mainNavOptions} />
                  <AllProducts />
                </Route>
                <Route path="/brands">
                  <MainNavbar options={mainNavOptions} />
                  <Brands />
                </Route>
                <Route path="/cart">
                  <MainNavbar options={mainNavOptions} />
                  <Cart />
                </Route>
                <Route path="/signin">
                  <MainNavbar options={mainNavOptions} />
                  <Signin />
                </Route>
                <Route path="/signup">
                  <MainNavbar options={mainNavOptions} />
                  <Signup />
                </Route>
                <Route path="/:category">
                  <MainNavbar options={mainNavOptions} />
                  <Category />
                </Route>
                {/* <Route path="/" children={<ComingSoon />} /> */}
                <Route path="/">
                  <MainNavbar options={mainNavOptions} />
                  <Home />
                </Route>
              </Switch>
              <div className="margin-global-top-8" />
              <IconBanner />
              <Footer />
            </div>
          </CSSTransition>
        </TransitionGroup>
      </DiscountContext.Provider>
    </CartContext.Provider>
  );
}

export default Routes;