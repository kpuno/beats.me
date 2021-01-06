import React from "react"
import { Formik, Form } from "formik"
import { Box, Button } from "@chakra-ui/react"
import { withApollo } from "../utils/withApollo"
import { Wrapper, InputField } from "../components"
import { MeQuery, MeDocument, useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router"
import { toErrorMap } from "../utils/toErrorMap"

const Register = () => {
  const [register] = useRegisterMutation();
  const router = useRouter()

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.register.user,
                },
              })
              // cache.evict({ fieldName: "posts:{}" })
            },
          })
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors))
          } else if (response.data?.register.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next)
            } else {
              // worked
              router.push("/home")
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="username"
            />
            <InputField
              name="email"
              placeholder="email"
              label="email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withApollo({ ssr: false })(Register)