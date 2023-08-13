import React from 'react'
import { Helmet } from 'react-helmet-async'

interface Props {
  title: string,
}

const PageTitle = (props: Props) => (
  <Helmet>
    <title>{props.title} | Albums</title>
  </Helmet>
)

export default PageTitle