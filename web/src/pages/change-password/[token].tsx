import { Box, Button, Link } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { InputField, Wrapper } from "../../components"
import { useChangePasswordMutation } from "../../generated/graphql"
import { toErrorMap } from "../../utils/toErrorMap"
import NextLink from "next/link"
import { withApollo } from "../../utils/withApollo"

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter()
  const [changePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState('')

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: { 
              newPassword: values.newPassword,
              token,
            }, 
          })
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors)
            if ('token' in errorMap) {
              setTokenError(errorMap.token)
            }
            setErrors(errorMap)
          } else if (response.data?.changePassword.user) {
            // worked
            router.push("/")
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type="password"
              />
            </Box>
            {tokenError ? (
                <Box>
                  <Box style={{ color: "red" }} mr={2}>{tokenError}</Box> 
                  <NextLink href="/forgot-password">
                    <Link>Go forget it again</Link>
                  </NextLink>
                </Box>
              ) : null
             }
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  }
}

export default withApollo({ ssr: false })(ChangePassword)
