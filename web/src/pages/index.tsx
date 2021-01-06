import React from "react"
import { Box, Link } from "@chakra-ui/react"
import NextLink from "next/link"
import { withApollo } from "../utils/withApollo"

// TODO: add error handling for queries
// TOODO: add functionality to reset cache on logout

const Index = () => (
  <Box w="100%" h="100%">
    <NextLink href="/login">
      <Link ml="auto">Login</Link>
    </NextLink>
    <NextLink href="/register">
      <Link ml="auto">Register</Link>
    </NextLink>
  </Box>
)

export default withApollo({ ssr: true })(Index)