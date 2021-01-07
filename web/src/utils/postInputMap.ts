export const postInputMap = (values) => {
  let beats = []
  Object.keys(values)
    .filter(key => /beat/.test(key))
    .forEach(key => {
      let index = key.slice(-1)

      beats.push({
       beat: values[key],
       label: values[`label-${index}`]
      })
    })
    // refactor the code above, addes undefined in first element
    beats.shift()

    return {
      input: {
        description: values.description,
        image: values.image,
      },
      beatsInput: beats 
    }
}