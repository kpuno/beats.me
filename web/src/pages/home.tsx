import React from "react"
import { Box, Button, Link } from "@chakra-ui/react"
import NextLink from "next/link"
import { withApollo } from "../utils/withApollo"
import { useMeQuery, useLogoutMutation } from "../generated/graphql"
import { isServer } from "../utils/isServer"
import { useApolloClient } from "@apollo/client"

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation()
  const apolloClient = useApolloClient()
  const { data, loading } = useMeQuery({
    skip: isServer(),
  })

  let body = null;

  // data is loading
  if (loading) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          logout
        </Button>
      </>
    )
  }

  return (
    <Box w="100%" h="100%">
      Home Page
      {body}
    </Box>
  )
}

export default withApollo({ ssr: true })(Home)