import { type APIRequestContext } from '@playwright/test';

interface LoginPayLoad {
  userEmail: string;
  userPassword: string;
}

interface OrderPayLoad {
  orders: { country: string; productOrderedId: string }[];
}

interface ApiResponse {
  token: string;
  orderId: string;
}

export class APiUtils {
  apiContext: APIRequestContext;
  loginPayLoad: LoginPayLoad;

  constructor(apiContext: APIRequestContext, loginPayLoad: LoginPayLoad) {
    this.apiContext = apiContext;
    this.loginPayLoad = loginPayLoad;
  }

  async getToken(): Promise<string> {
    const loginResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      {
        data: this.loginPayLoad,
      }
    );
    const loginResponseJson = await loginResponse.json();
    const token = loginResponseJson.token;
    console.log(token);
    return token;
  }

  async createOrder(orderPayLoad: OrderPayLoad): Promise<ApiResponse> {
    const token = await this.getToken();
    const orderResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayLoad,
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);
    const orderId = orderResponseJson.orders[0];

    return { token, orderId };
  }
}
