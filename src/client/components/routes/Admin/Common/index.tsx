import React from 'react'
import style from './style.scss'

export const Form = (props: {
  handleSubmit: React.FormEventHandler,
  children: any,
}) => (
  <form 
    onSubmit={props.handleSubmit}
    className={style['form']}
  >
    {props.children}
  </form>
)

export const FormGroup = (props: {
  children: any,
}) => <div className={style['form-group']}>{props.children}</div>

export const Label = (props: {
  label: string,
  name: string,
}) => (
  <label 
    htmlFor={props.name} 
    className={style['label']}
  >
    {props.label}
  </label>
)

export const InputError = (props: {
  error: string | null,
}) => props.error !== null && (
  <p className={style['error']}>{props.error}</p>
) || null

export const Input = (props: {
  label: string,
  name: string,
  value: string,
  error: string | null,
  handleChange: React.FormEventHandler<HTMLInputElement>,
  disabled: boolean,
}) => (
  <FormGroup>
    <Label 
      label={props.label} 
      name={props.name}
    />

    <input 
      id={props.name} 
      className={style['input']} 
      name={props.name} 
      value={props.value} 
      onChange={props.handleChange} 
      disabled={props.disabled}
    />

    <InputError error={props.error}/>
  </FormGroup>
)

export const Select = (props: {
  label: string,
  name: string,
  error: string | null,
  handleChange: React.FormEventHandler<HTMLSelectElement>,
  disabled: boolean,
  children: any,
  value: string,
}) => (
  <FormGroup>
    <Label
      label={props.label}
      name={props.name}
    />

    <select
      id={props.name}
      className={style['input']}
      name={props.name}
      onChange={props.handleChange}
      disabled={props.disabled}
      value={props.value}
    >
      {props.children}
    </select>

    <InputError error={props.error}/>
  </FormGroup>
)

export const Outcome = ({
  error,
  success,
  successMessage = 'Done',
  clearSuccess,
}: {
  error: string | null,
  success?: boolean,
  successMessage?: string,
  clearSuccess?: () => void,
}) => (error !== null || success) && (
  <p className={style['outcome'] + ' ' + style[success ? 'is-success' : 'is-error']}>
    <i className={'material-icons-round' + ' ' + style['outcome-icon']}>{success ? 'done' : 'priority_high'}</i>
    <span className={style['outcome-message']}>{success ? successMessage : error}</span>
    {success && (clearSuccess !== undefined) && (
      <button className={style['outcome-close']} onClick={clearSuccess}>
        <i className={'material-icons-round'}>close</i>
      </button>
    )}
  </p>
) || null

export const SubmitButton = (props: {
  disabled: boolean,
  children: string,
}) => (
  <button 
    type={'submit'} 
    className={style['submit']} 
    disabled={props.disabled}
  >
    {props.children}
  </button>
)

export const DeleteButton = (props: {
  disabled: boolean,
  children: string,
  handleDelete: React.MouseEventHandler<HTMLButtonElement>,
}) => (
  <button
    className={style['delete']}
    disabled={props.disabled}
    onClick={props.handleDelete}
  >
    {props.children}
  </button>
)