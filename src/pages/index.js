import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout.js"

export default function Home({ data }) {
  return (
    <Layout>
      <div>
        <h4>{ data.allMarkdownRemark.totalCount } Posts</h4>
        { data.allMarkdownRemark.edges.map(({ node }) => (
          <div key={node.id}>
            <Link to={node.fields.slug} style={{ textDecoration: `none`, color: `inherit` }} >
              <h3 style={{ marginBottom: `20px` }} >
                { node.frontmatter.title }{ " " }
                <span style={{ color: `#bbb` }} >
                  — { node.frontmatter.date }
                </span>
              </h3>
              <p>{ node.excerpt }</p>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: {
        fields: [frontmatter___date]
        order: DESC
      }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }`