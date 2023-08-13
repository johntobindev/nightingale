import React, { Component, ReactEventHandler } from 'react'
import style from './style.scss'
import { Link } from 'react-router-dom'
import { PropsFromRedux } from './Connected'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { AlbumType } from '../../../state/album/types'
import Header from './Header'
import Utils from '../../../../global/Utils'
import LoadingSpinner, { Placeholder } from '../../common/LoadingSpinner'
import PageTitle from '../../common/PageTitle'
import Validator, { createUrl, getQueryOptions, perPage } from '../../../../api/Albums/Validator'
import VisibilitySensor from 'react-visibility-sensor'
import Image from '../../common/Image'

type Props = PropsFromRedux & RouteComponentProps<{
  artist?: string,
}>

interface State {
  page: number,
}

class GetAlbums extends Component<Props, State> {
  state = {
    page: 1,
  }

  componentDidMount() {
    const { artist: artistSlug } = this.props.match.params
    const queryOptions = getQueryOptions(this.props.location.search)

    const preparedOptions = Validator.prepareOptions({
      ...queryOptions,
      artistSlug,
    })

    if (!this.props.initialised || Utils.objectsChanged(this.props.options, preparedOptions))
      this.props.getAlbums(
        artistSlug,
        queryOptions['sortBy'],
        queryOptions['decade'],
        queryOptions['search'],
      )
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.loading) return

    const artistSlug = this.props.match.params.artist
    const oldQueryOptions = getQueryOptions(prevProps.location.search)
    const newQueryOptions = getQueryOptions(this.props.location.search)

    if (Utils.objectsChanged(oldQueryOptions, newQueryOptions)) {
      this.setState({ page: 1 })
      this.props.getAlbums(
        artistSlug,
        newQueryOptions['sortBy'],
        newQueryOptions['decade'],
        newQueryOptions['search'],
      )
    }

    else if (prevState.page !== this.state.page)
      this.props.getAlbums(
        artistSlug,
        newQueryOptions['sortBy'],
        newQueryOptions['decade'],
        newQueryOptions['search'],
        this.state.page,
      )
  }

  handleSensor = (isVisible: boolean) => {
    if (isVisible && !this.props.loading)
      this.setState({ page: this.state.page + 1 })
  }

  handleScrollup: ReactEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }

  render() {
    const { numAlbums, albums, error, location, loading } = this.props
    const { pathname, search } = location
    const queryOptions = getQueryOptions(search)

    const thereAreMorePages = (this.state.page * perPage) < numAlbums

    return (
      <div className={style['container']}>
        <Header numAlbums={numAlbums} loading={loading}/>

        {queryOptions.search !== undefined && (
          <div className={style['search-results']}>
            <PageTitle title={`Search results for '${queryOptions.search}'`}/>
            <span>{queryOptions.search}</span>

            <Link to={createUrl(pathname, { ...queryOptions, search: undefined })}>
              <i className={'fas fa-times'}></i>
            </Link>
          </div>
        )}

        {error !== null && <p className={style['error']}>{error} 😔</p>}

        {error === null && (
          <div className={style['albums']}>
            {albums.map((album, index) => (
              <Album key={index} {...album}/>
            ))}
          </div>
        )}

        {loading && <LoadingSpinner/>}

        {error === null && !loading && thereAreMorePages && (
          <VisibilitySensor onChange={this.handleSensor}>
            <Placeholder/>
          </VisibilitySensor>
        )}

        {error === null && !loading && !thereAreMorePages && albums.length >= perPage && (
          <button
            onClick={this.handleScrollup}
            className={style['scroll-up']}
          >
            <i className={'fas fa-arrow-up'}></i>
          </button>
        )}
      </div>
    )
  }
}

export default withRouter(GetAlbums)

const Album = (props: AlbumType) => (
  <Link className={style['album']} to={`/${props.artist.slug}/${props.slug}`}>
    {/*<div className={style['album-art']} style={{
      backgroundImage: `url('/static/images/uploads/${props.image}_400')`,
    }}></div>*/}

    <div className={style['album-art']}>
      <Image
        src={`/static/images/uploads/${props.image}_400`}
        alt={''}
        className={style['album-art-img']}
      />
    </div>

    <div className={style['album-details']}>
      <div className={style['album-artist']}>{props.artist.name}</div>
      <div className={style['album-title']}>{props.name}</div>
      <div className={style['album-year']}>{props.year}</div>
    </div>
  </Link>
)