import "./scss/styles.scss";
import { ProductCatalog } from "./components/Models/ProductCatalog";
import { Basket } from "./components/Models/Basket.ts";
import { Buyer } from "./components/Models/Buyer.ts";
import { apiProducts } from "./utils/data.ts";
import { Api } from "./components/base/Api.ts";
import { CommunicationLayer } from "./components/CommunicationLayer.ts";
import {API_URL} from "./utils/constants.ts";

const productsModel = new ProductCatalog();
productsModel.setProducts(apiProducts.items);

console.log("Массив товаров из каталога: ", productsModel.getProducts());
console.log(
  "Конкретный предмет по id: ",
  productsModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390"),
);
productsModel.setCurrentProduct(productsModel.getProducts()[1]);
console.log("Текущий предмет: ", productsModel.getCurrentProduct());

console.log("--------------");
const basketModel = new Basket();
basketModel.addProduct(productsModel.getProducts()[1]);
basketModel.addProduct(productsModel.getProducts()[2]);
console.log("Массив товаров из корзины: ", basketModel.getProducts());

basketModel.deleteProduct(productsModel.getProducts()[2]);
console.log(
  "Массив товаров из корзины после изменений: ",
  basketModel.getProducts(),
);

basketModel.clearBasket();
console.log(
  "Массив товаров из корзины после очистки: ",
  basketModel.getProducts(),
);

basketModel.addProduct(productsModel.getProducts()[1]);
basketModel.addProduct(productsModel.getProducts()[2]);
console.log("Цена товаров в корзине: ", basketModel.getGeneralPrice());
console.log("Количество товаров в корзине: ", basketModel.getProductsAmount());

console.log("--------------");
const buyerModel = new Buyer();
buyerModel.setBuyerPayment("card");
console.log("Текущие данные пользователи: ", buyerModel.getBuyer());
console.log(
  "Нынешнее состояние данных пользователя: ",
  buyerModel.validateBuyer(),
);

buyerModel.setBuyerEmail("test@adrees.gmail");
buyerModel.setBuyerPhone("8-900-900-90-90");
buyerModel.setBuyerAddress("St Petersburg");
console.log("Текущие данные пользователи: ", buyerModel.getBuyer());
console.log(
  "Нынешнее состояние данных пользователя: ",
  buyerModel.validateBuyer(),
);

buyerModel.clearBuyer();
console.log(
  "Нынешнее состояние данных пользователя: ",
  buyerModel.validateBuyer(),
);

const url: string = API_URL;
const apiInstance = new Api(url);
const commLayer = new CommunicationLayer(apiInstance);

console.log(API_URL);
commLayer
  .fetchProducts()
  .then((response) => {
    productsModel.setProducts(response.items);
    console.log("Каталог, загруженный с сервера:", productsModel.getProducts());
  })
  .catch((error) => {
    console.error("Ошибка загрузки каталога:", error);
  });
