import { Box } from '@chakra-ui/react'
import React from 'react'
import { InputField } from '.'
import { CloseIcon } from '@chakra-ui/icons'

interface BeatInputProps {
  beatNum: number,
  removeInput: Function,
  beats: Array<number>
}

const BeatInput: React.FC<BeatInputProps> = ({
  beatNum,
  removeInput,
  beats
}) => {
    return (
      <Box mt={4}>
        <InputField
          name={`beat-${beatNum}`}
          placeholder="beat"
          label="Beat"
        />
        <InputField
          name={`label-${beatNum}`}
          placeholder="label"
          label="Label"
        />
        { beatNum ===  beats.length &&
          beats.length !== 1 && <CloseIcon onClick={() => removeInput(beatNum)} /> 
        }
      </Box>
    )
}

export default BeatInput