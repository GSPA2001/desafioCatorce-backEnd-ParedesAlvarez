// Para el test npx mocha test/*.test.js
import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import Cart from "../src/models/cart.model.js";

describe("Cart Router", () => {
  let cartId;

  before(async () => {
    const newCart = new Cart({
      products: ["65f0d5054637dec2bc7a09b4", "65f0d5054637dec2bc7a09b5"],
      total: 12318.73,
    });
    const savedCart = await newCart.save();
    cartId = savedCart._id;
  });

  after(async () => {
    await Cart.deleteMany({});
  });

  it("should return all carts with status code 200", async () => {
    const response = await request(app)
      .get("/api/carts")
      .expect(200)
      .expect("Content-Type", /json/);
  
    expect(Array.isArray(response.body.carts)).to.be.true;
  });

  it("should return a cart by ID with status code 200", async () => {
    // Obtén el ID del carrito agregado anteriormente en la base de datos
    const carts = await Cart.find();
    const cartId = carts[0]._id;
  
    const response = await request(app)
      .get(`/api/carts/${cartId}`)
      .expect(200)
      .expect("Content-Type", /json/);
  
    expect(response.body.payload).to.have.property("_id");
  });

});