import { Box, Flex, Link, Button } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import React, { useState } from "react"
import { InputField, Wrapper } from "../components"
import { MeQuery, MeDocument, useCreatePostMutation } from "../generated/graphql"
import { withApollo } from "../utils/withApollo"
import login from "./login"
import { AddIcon } from '@chakra-ui/icons'
import { BeatInput } from "../components"
import { postInputMap } from "../utils/postInputMap"

interface CreatePostProps {

}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const [createPost] = useCreatePostMutation()
  const [beats, setBeats] = useState([1])

  return (
    <Wrapper variant="small">
      <p>Create Post</p>
      <Formik
        initialValues={{input: {
          description: "",
          image: "",
        },
        beatsInput: []}}
        onSubmit={async (values, { setErrors }) => {
          let postValues = postInputMap(values)

          console.log(postValues)

          const response = await createPost({
            variables: postValues
          })
          console.log(response.data?.createPost.creator)
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="description"
              placeholder="description"
              label="description"
            />
            <Box mt={4}>
              <InputField
                name="image"
                placeholder="image"
                label="image"
              />
            </Box>
            { beats.map((b) => (
              <BeatInput 
                beatNum={b} 
                beats={beats}
                removeInput={(beatNum) => setBeats(beats.filter(
                  num => num !== beatNum
                ))}
              />
              )
            )}

            <AddIcon onClick={() => setBeats([...beats, beats.length+1])} />
            
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withApollo({ ssr: false })(CreatePost)