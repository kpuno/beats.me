import React from "react"
import { Box } from "@chakra-ui/react"
import Link from "next/link"
import { withApollo } from "../utils/withApollo"

const Index = () => (
  <Box w="100%" h="100%">
  </Box>
)

export default withApollo({ ssr: true })(Index)