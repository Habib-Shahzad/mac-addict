import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import { SmallBanner, SearchNavbar, MainNavbar, IconBanner, Footer } from './components';
import { Home, Brands, Product, Category, SubCategory, FurtherSubCategory, Signin, Signup, Cart } from './pages';
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
              to: `/categories/${category.slug}`
            }
            if (category.subCategories.length === 0) {
              newCat.content[0]['to'] = `/categories/${category.slug}`;
            } else {
              newCat.content[0]['children'] = [
                {
                  content: [
                    { id: category._id, name: `All ${category.name}`, to: `/categories/${category.slug}` }
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
                  to: `/categories/${category.slug}/${subCategory.slug}`
                }
                if (subCategory.furtherSubCategories.length === 0) {
                  newSubCat['to'] = `/categories/${category.slug}/${subCategory.slug}`;
                } else {
                  newSubCat['children'] = [
                    {
                      content: [
                        { id: subCategory._id, name: `All ${subCategory.name}`, to: `/categories/${category.slug}/${subCategory.slug}` }
                      ]
                    }
                  ];
                  mainNewSubCat['children'] = [];
                  subCategory.furtherSubCategories.forEach(furtherSubCategory => {
                    const newFurtherSubCat = { id: furtherSubCategory._id, name: furtherSubCategory.name, to: `/categories/${category.slug}/${subCategory.slug}/${furtherSubCategory.slug}` };
                    const mainNewFurtherSubCat = { name: furtherSubCategory.name, to: `/categories/${category.slug}/${subCategory.slug}/${furtherSubCategory.slug}` };
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


  const [data, setData] = useState({});

  useEffect(() => {
    (
      async () => {
        const cityData = await fetch(`${api}/city/table-data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          withCredentials: true,
        });
        const cities = await cityData.json();


        const provinceData = await fetch(`${api}/province/table-data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          withCredentials: true,
        });

        const provinces = await provinceData.json();



        const countryData = await fetch(`${api}/country/table-data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          withCredentials: true,
        });

        let _data = {};

        const countries = await countryData.json();

        _data["countries"] = [];

        countries.data.forEach(country => {
          _data["countries"].push({ "_id": country._id, "name": country.name });
        })

        provinces.data.forEach(province => {
          let country = province.country;

          if (!_data[country._id]) {
            _data[country._id] = {};
            _data[country._id]["provinces"] = [];
          }
          _data[country._id]["provinces"].push({ "_id": province._id, "name": province.name });
        })

        cities.data.forEach(city => {
          let province = city.province;
          let country = city.province.country;

          if (!_data[country._id][province._id]) {
            _data[country._id][province._id] = [];
          }
          _data[country._id][province._id].push({ "_id": city._id, "name": city.name });
        });

        setData(_data);

      })();
  }, []);

  return (
    <CountriesContext.Provider value={{ data: data }}>
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


                  <Route path="/categories/:category/:subCategory/:furtherSubCategory">
                    <MainNavbar options={mainNavOptions} />
                    <FurtherSubCategory />
                  </Route>

                  <Route path="/categories/:category/:subCategory">
                    <MainNavbar options={mainNavOptions} />
                    <SubCategory />
                  </Route>


                  <Route path="/categories/:category">
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