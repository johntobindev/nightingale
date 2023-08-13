import React, { Component } from 'react'
import style from './style.scss'
import LoadingSpinner from '../../../common/LoadingSpinner'
import { FormGroup, Label, InputError } from '../Common'

type Props = {
  label: string,
  disabled: boolean,
  uploading: boolean,
  image: string | null,
  uploadImage: (file: File) => void,
  error: string | null,
}

class UploadImage extends Component<Props> {
  handleChange: React.FormEventHandler<HTMLInputElement> = e => {
    e.preventDefault()
    if (e.currentTarget.files === null) return
    const file = e.currentTarget.files[0]
    this.props.uploadImage(file)
  }

  render() {
    const { label, uploading, disabled, image, error } = this.props

    const backgroundImageUrl = image !== null 
      ? `url('/static/images/uploads/${image}_400')` 
      : ''

    return (
      <FormGroup>
        <Label name={'image-uploader'} label={label}/>
        
        <div className={style['sections']}>
          <div className={style['section']}>
            <label className={uploading ? style['is-uploading'] : (disabled ? style['is-disabled'] : '')}>
              <input 
                id={'image-uploader'} 
                type={'file'} 
                className={style['input']} 
                onChange={this.handleChange} 
                disabled={disabled}
              />

              <div className={style['preview']} style={{ backgroundImage: backgroundImageUrl }}>
                <div className={style['preview-spacer']}></div>

                <div className={style['preview-inner']}>
                  {image === null && !uploading && (
                    <div className={style['preview-text']}>
                      <i className={'material-icons-round'}>add_circle</i>
                      <div>Upload image</div>
                    </div>
                  )}

                  {uploading && <LoadingSpinner/>}
                </div>
              </div>
            </label>
          </div>

          <div className={style['section']}>
            <p className={style['guidelines']}>
              File must be .jpg/jpeg, .png, or .webp, and must not exceed 350KB. Images should be around 800x800 pixels.
            </p>
          </div>
        </div>

        <InputError error={error}/>
      </FormGroup>
    )
  }
}
export default UploadImage