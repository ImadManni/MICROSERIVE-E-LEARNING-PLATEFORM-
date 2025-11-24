import { GraphQLClient, gql } from "graphql-request"

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8080/api/cours/graphql"

export function getGraphQLClient() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  return new GraphQLClient(endpoint, {
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  })
}

// GraphQL Queries
export const GET_COURSE = gql`
  query GetCourse($id: ID!) {
    course(id: $id) {
      id
      title
      description
      price
      youtubeVideoId
      createdAt
      professor {
        id
        fullName
        email
        bio
        avatarUrl
      }
      category {
        id
        name
      }
      lessons {
        id
        title
        content
        duration
      }
    }
  }
`

export const GET_COURSES = gql`
  query GetCourses($page: Int, $size: Int) {
    courses(page: $page, size: $size) {
      content {
        id
        title
        description
        price
        youtubeVideoId
        professor {
          fullName
        }
        category {
          name
        }
      }
      totalElements
      totalPages
    }
  }
`

export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CourseInput!) {
    createCourse(input: $input) {
      id
      title
    }
  }
`

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $input: CourseInput!) {
    updateCourse(id: $id, input: $input) {
      id
      title
    }
  }
`

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`
