import React from 'react'
import PageTitle from '../PageTitle'

interface Props {
  error: string,
}

const ErrorPage = (props: Props) => (
  <div style={{ padding: '2rem' }}>
    <PageTitle title={'Error'}/>

    <span>{props.error}</span>
  </div>
)

export default ErrorPage