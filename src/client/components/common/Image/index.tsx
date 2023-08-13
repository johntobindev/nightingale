import React, { useState } from 'react'

const Image = (props: {
  src: string,
  className: string,
  alt?: string,
}) => {
  const [ isLoaded, setIsLoaded ] = useState(false)

  return <img
    style={{ display: isLoaded ? 'block' : 'none' }}
    onLoad={() => setIsLoaded(true)}
    {...props}
  />
}

export default Image