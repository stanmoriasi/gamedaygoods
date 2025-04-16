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
  
  type Order {
    _id: ID!
    products: [Product!]!
    total: Float
    createdAt: String!
  }

  type CartItem {
  _id: ID!
  name: String!
  price: Float!
  quantity: Int!
}

  input OrderInput {
    products: [ID!]!
    
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
    placeOrder(input: [ID!]!): Order
    addProduct(input: ProductInput!): Product
    addOrder(orderId: ID!, OrderInput!): Order
  }
`;

export default typeDefs;
