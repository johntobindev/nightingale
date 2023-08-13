import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import style from './style.scss'
import { PropsFromRedux } from './Connected'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import PageTitle from '../../../common/PageTitle'
import Image from '../../../common/Image'

type Props = PropsFromRedux & RouteComponentProps<{
  artist: string,
  album?: string,
}>

class Header extends Component<Props> {
  componentDidMount() {
    const { artist: artistSlug } = this.props.match.params

    if (this.props.artistState.slug !== artistSlug)
      this.props.getArtist(artistSlug)
  }

  render() {
    const { artistState, albumState } = this.props
    const { artist } = artistState
    const { album } = albumState

    const albumParamExists = this.props.match.params.album !== undefined

    const pageTitle =
      artist === null
        ? 'Loading...'
        : artist.name + (album !== null && albumParamExists ? ` - ${album.name} (${album.year})` : '')

    if (artistState.error) return (
      <div>
        <PageTitle title={artistState.error}/>
        {artistState.error}
      </div>
    )

    return (
      <div className={style['header']}>
        <PageTitle title={pageTitle}/>

        {artist !== null && (
          <Link to={`/${artist.slug}`} className={style['image']}>
            <Image
              src={`/static/images/uploads/${artist.image}_400`}
              alt={''}
              className={style['image-img']}
            />
          </Link>
        )}

        {artist !== null && (
          <div className={style['wrapper']}>
            <Link
              to={`/${artist.slug}`}
              className={style['name'] + (album === null || !albumParamExists ? (' ' + style['is-active']) : '')}
            >{artist.name}</Link>

            {album !== null && albumParamExists && (
              <div>
                <Link
                  to={`/${artist.slug}/${album.slug}`}
                  className={style['name'] + ' ' + style['is-active']}
                >{album.name}</Link>

                <div className={style['year']}>{album.year}</div>
              </div>
            )}
          </div>
        )}

        {artist !== null && (
          <div className={style['edit-links']}>
            <Link to={`/admin/edit-artist/${artist.id}`} className={style['edit-link']}>
              Edit artist
            </Link>

            {album !== null && albumParamExists && (
              <Link to={`/admin/edit-album/${album.id}`} className={style['edit-link']}>
                Edit album
              </Link>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(Header)