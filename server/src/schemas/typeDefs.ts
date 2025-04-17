const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    orders: [Order!]!
  }

    type Thought {
    _id: ID
    thoughtText: String
    thoughtAuthor: String
    createdAt: String
    comments: [Comment]!
  }
  input ThoughtInput {
    thoughtText: String!
    thoughtAuthor: String!
  }
  type Comment {
    _id: ID
    commentText: String
    createdAt: String
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
  
  type Address {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }

  type CartItem {
  productId: ID!
  quantity: Int!
}

input CartItemInput {
  productId: ID!
  quantity: Int!
}
  
  type Order {
    products: [CartItem!]!
    address: Address
    amount: Float!
  }

  input OrderInput {
    products: [CartItemInput!]!
    address: AddressInput
  }

  input AddressInput {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
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
    cart: Order
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    addThought(input: ThoughtInput!): Thought
    addComment(thoughtId: ID!, commentText: String!): Thought
    removeThought(thoughtId: ID!): Thought
    removeComment(thoughtId: ID!, commentId: ID!): Thought
    placeOrder(order: OrderInput!): Order
    addProduct(input: ProductInput!): Product
  }
`;

export default typeDefs;
