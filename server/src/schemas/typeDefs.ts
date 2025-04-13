const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    orders: [Order!]!
  }


  type Product{
  _id: ID
  productName: String
  category: String
  description: String
  price: Float
  quantity: Int
  createdAt: String
  images: [String]
  inStock: Boolean!
  }
  
  type Order {
    _id: ID!
    products: [Product!]!
    total: Float!
    createdAt: String!
  }

   input ProductInput {
    name: String!
    description: String!
    price: Float!
    image: String
    category: String!
    inStock: Boolean!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }
  
  type Auth {
    token: ID!
    user: User
  }

    type Query {
    me: User
    users: [User]
    user(username: String!): User
    products: [Product]
    product(productId: ID!): Product
    orders: [Order!]!
    order(orderId: ID!): Order
  }

  type Mutation {
    register(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    addProduct(input: ProductInput!): Product
    updateProduct(productId: ID!, input: ProductInput!): Product
    removeProduct(productId: ID!): Product
    placeOrder(input: OrderInput!): Order
  }
`;

export default typeDefs;
