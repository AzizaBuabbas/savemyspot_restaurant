import { decorate, observable } from "mobx";
import instance from "./instance";
import jwt_decode from "jwt-decode";

class AuthStore {
  constructor() {
    this.user = null;
    this.restaurants = [];
    this.restaurant = null;
    this.restaurantid = null;
    this.loading = true;
    this.restaurantLoading = true;
    this.queue = [];
    this.queueLoading = true;
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

  getRestaurantDetails(restaurantid) {
    instance
      .get(`restaurant/detail/${restaurantid}/`)
      .then(restaurantid => {
        this.restaurantid = restaurantid;
        this.restaurauntLoading = false;
      })
      .catch(err => console.error(err));
  }
  getRestaurantlist() {
    instance
      .get("restaurant/list/")
      .then(restaurants => {
        this.restaurants = restaurants;
        this.restaurauntLoading = false;
      })
      .catch(err => console.error(err));
  }

  getQueuelist() {
    instance
      .get("queue/list/")
      .then(queue => {
        this.queue = this.queue;
        this.queueLoading = false;
      })
      .catch(err => console.error(err));
  }

  // fetchQueuelist = async () => {
  //    try {
  //      let res = await instance.get("queue/list/");
  //      this.queue = res.data;
  //      this.queueloading = false;
  //    } catch (err) {
  //      console.error(err.stack);
  //    }

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
  restaurantLoading: observable,
  restaurants: observable,
  queue: observable,
  queueLoading: observable
});

const authstore = new AuthStore();

export default authstore;
