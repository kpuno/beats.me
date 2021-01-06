import { Box, Flex, Link, Button } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { InputField, Wrapper } from "../components"
import { useForgotPasswordMutation } from "../generated/graphql"
import { withApollo } from "../utils/withApollo"

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false)
    const [forgotPassword] = useForgotPasswordMutation()
    return (
      <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await forgotPassword({
            variables: values,
          })
          setComplete(true)
        }}
      >
        {
          ({ isSubmitting }) => complete ? <Box>If an account with that email exists, we sent you an email</Box> : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="email"
                type="email"
              />
              <Button 
                mt={4}
                type="submit" 
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Forgot Password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
    )
}

export default withApollo({ ssr: false })(ForgotPassword)