import React, { Component } from 'react'
import { PropsFromRedux } from './Connected'
import PageTitle from '../../../common/PageTitle'
import UploadImage from '../UploadImage'
import { Form, Input, SubmitButton, DeleteButton } from '../Common'
import { withRouter, RouteComponentProps } from 'react-router-dom'

type Props = {
  isUpdate?: boolean,
} & PropsFromRedux & RouteComponentProps<{ id?: string }>

class Artist extends Component<Props> {
  static defaultProps: Partial<Props> = {
    isUpdate: false,
  }

  componentDidMount() {
    if (!this.props.initialised && this.props.isUpdate)
      this.props.initialise(this.props.match.params.id)
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isUpdate) {
      if (!prevProps.isDeleted && this.props.isDeleted)
        return this.props.history.replace('/')

      if (prevProps.initialised && !this.props.initialised)
        this.props.initialise(this.props.match.params.id)
    }
  }

  componentWillUnmount() {
    this.props.reset()
  }

  handleChange: React.FormEventHandler<HTMLInputElement> = e => {
    e.preventDefault()
    this.props.setValue(e.currentTarget.name, e.currentTarget.value)
  }

  handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    if (this.props.isUpdate) this.props.updateArtist()
    else this.props.addArtist()
  }

  handleDeleteArtist: React.FormEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    const confirmed = confirm('Are you sure you want to delete this artist? All of this artist\'s albums will be deleted too.')
    if (confirmed) this.props.deleteArtist()
  }

  render() {
    const { initialised, loading, uploading, uploadImage, image, errors, name, slug, isUpdate } = this.props
    const disabled = loading || (isUpdate !== undefined && isUpdate && !initialised)

    return (
      <div>
        <PageTitle title={this.props.isUpdate ? 'Update artist' : 'Add new artist'}/>

        <Form handleSubmit={this.handleSubmit}>
          <UploadImage
            label={'Artist image'}
            disabled={disabled || uploading}
            uploading={uploading}
            uploadImage={uploadImage}
            image={image}
            error={errors.image}
          />

          <Input
            label={'Name'}
            name={'name'}
            value={name}
            error={errors.name}
            handleChange={this.handleChange}
            disabled={disabled}
          />

          <Input
            label={'Slug'}
            name={'slug'}
            value={slug}
            error={errors.slug}
            handleChange={this.handleChange}
            disabled={disabled}
          />

          <SubmitButton disabled={disabled || uploading}>
            {this.props.isUpdate ? 'Update artist' : 'Add artist'}
          </SubmitButton>

          {this.props.isUpdate && (
            <DeleteButton disabled={disabled || uploading} handleDelete={this.handleDeleteArtist}>
              Delete artist
            </DeleteButton>
          )}
        </Form>
      </div>
    )
  }
}

export default withRouter(Artist)