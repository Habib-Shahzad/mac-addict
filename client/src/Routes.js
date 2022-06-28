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
import CountriesContext from './contexts/country';
import api from './api';
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";

import './form.scss';
import './global.scss';

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


  const [countryData, setCountryData] = useState({});
  const [dataMappers, setDataMappers] = useState({});

  useEffect(() => {
    (
      async () => {
        const response = await fetch(`${api}/city/table-data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          withCredentials: true,
        });
        const content = await response.json();
        let countries = {};

        let countryMapper = {};
        let provinceMapper = {};
        let cityMapper = {};

        content.data.forEach(city => {
          let country_name = city.province.country.name;
          let province_name = city.province.name;
          let city_name = city.name;

          let country_id = city.province.country._id;
          let province_id = city.province._id;
          let city_id = city._id;

          if (!countryMapper[country_id]) countryMapper[country_id] = country_name;
          if (!provinceMapper[province_id]) provinceMapper[province_id] = province_name;
          if (!cityMapper[city_id]) cityMapper[city_id] = city_name;

          if (!countries[country_id]) countries[country_id] = {};
          if (!countries[country_id][province_id]) countries[country_id][province_id] = [];
          countries[country_id][province_id].push(city_id);
        })

        setDataMappers({ 'country': countryMapper, 'province': provinceMapper, 'city': cityMapper });
        setCountryData(countries);

      })();
  }, []);

  return (
    <CountriesContext.Provider value={{ data: countryData, dataMappers: dataMappers }}>
      <CartContext.Provider value={{ cartObj: cart, setCart: setCart }}>
        <DiscountContext.Provider value={discountState}>
          <SmallBanner />
          <div className="margin-global-top-1" />
          <SearchNavbar options={navOptions} />
          <TransitionGroup>
            <CSSTransition
              key={location.key}
              classNames="page"
              timeout={300}
            >
              <div className="page">
                <Switch location={location}>
                  <Route path="/dashboard">
                    <MainNavbar options={mainNavOptions} />
                    <Dashboard />
                  </Route>
                  <Route path="/product/:productSlug">
                    <MainNavbar options={mainNavOptions} />
                    <Product />
                  </Route>
                  <Route path="categories/:category/:subcategory/:furthersubcategory">
                    <MainNavbar options={mainNavOptions} />
                    <AllProducts />
                  </Route>
                  <Route path="categories/:category/:subcategory">
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
                  <Route path="categories/:category">
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
    </CountriesContext.Provider>
  );
}

export default Routes;