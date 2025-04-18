import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      thoughts {
        _id
        thoughtText
        createdAt
      }
    }
  }
`;

export const QUERY_THOUGHTS = gql`
  query getThoughts {
    thoughts {
      _id
      thoughtText
      thoughtAuthor
      createdAt
    }
  }
`;

export const QUERY_SINGLE_THOUGHT = gql`
  query getSingleThought($thoughtId: ID!) {
    thought(thoughtId: $thoughtId) {
      _id
      thoughtText
      thoughtAuthor
      createdAt
      comments {
        _id
        commentText
        commentAuthor
        createdAt
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      thoughts {
        _id
        thoughtText
        thoughtAuthor
        createdAt
      }
    }
  }
`;

export const QUERY_PRODUCTS = gql`
  query getProducts {
    products {
      _id
      productName
      category
      description
      price
      quantity
      createdAt
      images
    }
  }
`;

export const ADD_TO_ORDER = gql`
  mutation AddProductToOrder($orderId: ID!, $productId: ID!) {
    addProductToOrder(orderId: $orderId, productId: $productId) {
      _id
      user {
        _id
        username
      }
      products {
        _id
        productName
        price
      }
      total
      createdAt
    }
  }
`;

export const GET_CART = gql`
  query GetCart {
    cart {
      _id
      products {
        _id
        productName
        price
        quantity
      }
      total
      status
      createdAt
    }
  }
`;

export const QUERY_USER_WITH_ORDERS = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      orders {
        _id
        products {
          productId
          quantity
        }
        amount
        address {
          street
          city
          state
          zipCode
          country
        }
        status
        createdAt
      }
    }
  }
`;

export const QUERY_ME_WITH_ORDERS = gql`
  query me {
    me {
      _id
      username
      email
      orders {
        _id
        products {
          productId
          quantity
        }
        amount
        address {
          street
          city
          state
          zipCode
          country
        }
        status
        createdAt
      }
    }
  }
`;

export const QUERY_PRODUCT_BY_ID = gql`
  query getProductById($productId: ID!) {
    product(productId: $productId) {
      _id
      productName
      description
      price
      quantity
      images
      category
    }
  }
`;
