import React, { Component } from 'react'
import style from './style.scss'
import { PropsFromRedux } from './Connected'
import PageTitle from '../../../common/PageTitle'
import UploadImage from '../UploadImage'
import { Form, FormGroup, Label, Input, Select, SubmitButton, DeleteButton } from '../Common'
import formStyle from '../Common/style.scss'
import { withRouter, RouteComponentProps } from 'react-router-dom'

type Props = {
  isUpdate?: boolean,
} & PropsFromRedux & RouteComponentProps<{ id?: string }>

class Album extends Component<Props> {
  static defaultProps: Partial<Props> = {
    isUpdate: false,
  }

  componentDidMount() {
    if (!this.props.initialised)
      if (this.props.isUpdate)
        this.props.initialise(this.props.match.params.id)
      else this.props.initialise()
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

  handleChange: React.FormEventHandler<HTMLInputElement | HTMLSelectElement> = e => {
    e.preventDefault()
    this.props.setValue(e.currentTarget.name, e.currentTarget.value)
  }

  handleEditTrack: React.FormEventHandler<HTMLInputElement> = e => {
    e.preventDefault()
    const key = Number(e.currentTarget.getAttribute('data-key'))
    this.props.editTrack(key, e.currentTarget.name, e.currentTarget.value)
  }

  handleMoveUp: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    const key = Number(e.currentTarget.getAttribute('data-key'))
    this.props.moveUp(key)
  }

  handleMoveDown: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    const key = Number(e.currentTarget.getAttribute('data-key'))
    this.props.moveDown(key)
  }

  handleDeleteTrack: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    const key = Number(e.currentTarget.getAttribute('data-key'))
    const id = e.currentTarget.getAttribute('data-id')
    this.props.deleteTrack(key, id)
  }

  handleAddTrack: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    this.props.addTrack()
  }

  handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    if (this.props.isUpdate) this.props.updateAlbum()
    else this.props.addAlbum()
  }

  handleDeleteAlbum: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    const confirmed = confirm('Are you sure you want to delete this album?')
    if (confirmed) this.props.deleteAlbum()
  }

  render() {
    const {
      loading,
      name,
      slug,
      year,
      tracks,
      artists,
      errors,
      uploading,
      uploadImage,
      image,
      artistId,
      initialised,
    } = this.props

    const disabled = loading || !initialised

    return (
      <div>
        <PageTitle title={this.props.isUpdate ? 'Update album' : 'Add new album'}/>

        <Form handleSubmit={this.handleSubmit}>
          <Select
            label={'Artist'}
            name={'artistId'}
            error={null}
            handleChange={this.handleChange}
            disabled={artists === null || disabled}
            value={artistId}
          >
            {
              artists === null
                ? <option>Loading...</option>
                : artists.map((item, index) => <option key={index} value={item.id}>{item.name}</option>)
            }
          </Select>

          <UploadImage
            label={'Album cover'}
            disabled={disabled || uploading}
            uploading={uploading}
            uploadImage={uploadImage}
            image={image}
            error={errors.image}
          />

          <Input
            label={'Title'}
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

          <Input
            label={'Year'}
            name={'year'}
            value={year}
            error={errors.year}
            handleChange={this.handleChange}
            disabled={disabled}
          />

          <FormGroup>
            <Label
              label={'Tracks'}
              name={'tracks'}
            />

            <div>
              <div className={style['header']}>
                <div className={style['number']}>#</div>
                <div className={style['title']}>Title</div>
                <div className={style['length']}>Length (seconds)</div>
                <div className={style['options']}></div>
              </div>

              {tracks.map((item, index) => (
                <div className={style['row']} key={index}>
                  <div className={style['number']}>
                    <span>Track&nbsp;</span>
                    {item.number}
                  </div>

                  <div className={style['title']}>
                    <label htmlFor={`title-${index}`}>Title</label>

                    <input
                      id={`title-${index}`}
                      value={item.name}
                      className={formStyle['input']}
                      name={'name'}
                      data-key={index}
                      onChange={this.handleEditTrack}
                      disabled={disabled}
                    />

                    {errors.tracks[index].name !== null && <div className={formStyle['error']}>{errors.tracks[index].name}</div>}
                  </div>

                  <div className={style['length']}>
                    <label htmlFor={`length-${index}`}>Length (seconds)</label>

                    <input
                      id={`length-${index}`}
                      value={item.lengthSeconds}
                      className={formStyle['input']}
                      name={'lengthSeconds'}
                      data-key={index}
                      onChange={this.handleEditTrack}
                      disabled={disabled}
                    />

                    {errors.tracks[index].lengthSeconds !== null && <div className={formStyle['error']}>{errors.tracks[index].lengthSeconds}</div>}
                  </div>

                  <div className={style['options']}>
                    <div className={style['options-inner']}>
                      <button
                        data-key={index}
                        className={style['options-button']}
                        onClick={this.handleMoveUp}
                        disabled={index === 0 || disabled}
                      >
                        <i className={'fas fa-caret-up'}></i>
                      </button>
                      <button
                        data-key={index}
                        className={style['options-button']}
                        onClick={this.handleMoveDown}
                        disabled={index === (tracks.length - 1) || disabled}
                      >
                        <i className={'fas fa-caret-down'}></i>
                      </button>
                      <button
                        data-key={index}
                        data-id={item.id}
                        className={style['options-button']}
                        onClick={this.handleDeleteTrack}
                        disabled={tracks.length === 1 || disabled}
                      >
                        <i className={'fas fa-times'}></i>
                      </button>
                    </div>
                  </div>

                  {(
                    errors.tracks[index].name !== null ||
                    errors.tracks[index].lengthSeconds !== null
                  ) && (
                    <ol className={style['errors'] + ' ' + formStyle['error']}>
                      {errors.tracks[index].name !== null && <li><span>Title:</span> {errors.tracks[index].name}</li>}
                      {errors.tracks[index].lengthSeconds !== null && <li><span>Length:</span> {errors.tracks[index].lengthSeconds}</li>}
                    </ol>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={this.handleAddTrack}
              className={style['add-track']}
              disabled={disabled}
            >
              <i className={'fas fa-plus'}></i>
              Add track
            </button>
          </FormGroup>

          <SubmitButton disabled={disabled || uploading}>
            {this.props.isUpdate ? 'Update album' : 'Add album'}
          </SubmitButton>

          {this.props.isUpdate && (
            <DeleteButton disabled={disabled || uploading} handleDelete={this.handleDeleteAlbum}>
              Delete album
            </DeleteButton>
          )}
        </Form>
      </div>
    )
  }
}

export default withRouter(Album)