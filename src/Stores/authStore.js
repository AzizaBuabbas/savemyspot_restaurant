import { decorate, observable } from "mobx";
import instance from "./instance";
import jwt_decode from "jwt-decode";

class AuthStore {
  constructor() {
    this.user = null;
    this.restaurant = null;
    this.restaurantid = null;
    this.loading = true;
    this.restaurantLoading = true;

    this.checkForToken();
  }

  setUser(token, restaurant, restaurantid) {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("restaurant", restaurant);
      localStorage.setItem("restaurantid", restaurantid);
      instance.defaults.headers.common.Authorization = `jwt ${token}`;
      instance.defaults.headers.common.Authorization = `${restaurant}`;
      instance.defaults.headers.common.Authorization = `${restaurantid}`;
      this.user = jwt_decode(token);
      this.loading = false;
      this.restaurant = restaurant;
      this.restaurantid = restaurantid;
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("restaurant");
      localStorage.removeItem("restaurantid");
      delete instance.defaults.headers.common.Authorization;
      this.user = null;
      this.restaurant = null;
      this.restaurantid = null;
    }
  }

  checkForToken() {
    const token = localStorage.getItem("token");
    const restaurant = localStorage.getItem("restaurant");
    const restaurantid = localStorage.getItem("restaurantid");
    if (token) {
      const user = jwt_decode(token);
      if (user.exp > Date.now() / 1000) {
        this.setUser(token, restaurant, restaurantid);
      } else {
        this.setUser();
      }
    }
  }

  authenticate(userData, type) {
    instance
      .post(`/${type}/`, userData)
      .then(res => res.data)
      .then(user => this.setUser(user.token))
      .catch(err => console.error(err));
  }

  loginUser = async (userData, history) => {
    instance
      .post("/signin/", userData)
      .then(res => {
        console.log(res.data);
        this.getRestaurantDetails(res.data.restaurant);
        this.restaurant = res.data.restaurant;

        return res.data;
      })
      .then(user => {
        this.setUser(user.token, this.restaurant, this.restaurantid);
        this.loading = false;
      })
      .then(() => history.push("/queue/"))
      .catch(err => console.error(err));
  };

  getRestaurantDetails(restaurantID) {
    instance
      .get(`restaurant/detail/${restaurantID}/`)
      .then(restaurant => {
        this.restaurantid = restaurant;
        this.restaurauntLoading = false;
      })
      .catch(err => console.error(err));
  }

  logout = async history => {
    await this.setUser();
    history.push("/login/");
  };
}

decorate(AuthStore, {
  user: observable,
  restaurant: observable,
  loading: observable,
  restaurantid: observable,
  restaurantLoading: observable
});

export default new AuthStore();
