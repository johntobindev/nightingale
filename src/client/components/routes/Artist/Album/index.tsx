import React, { Component } from 'react'
import style from './style.scss'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { PropsFromRedux } from './Connected'
import Utils from '../../../../../global/Utils'
import LoadingSpinner from '../../../common/LoadingSpinner'
import PageTitle from '../../../common/PageTitle'
import Image from '../../../common/Image'

type Props = PropsFromRedux & RouteComponentProps<{
  artist: string,
  album: string,
}>

interface State {
  totalLengthSeconds: number,
}

class Album extends Component<Props, State> {
  state = {
    totalLengthSeconds: 0,
  }

  componentDidMount() {
    const {
      artist: artistSlug,
      album: albumSlug,
    } = this.props.match.params

    if (this.props.slug !== albumSlug)
      this.props.getAlbum(artistSlug, albumSlug)
  }

  render() {
    const { album, error, loading } = this.props

    if (error !== null) return (
      <div>
        <PageTitle title={error}/>
        {error}
      </div>
    )

    if (loading) return <LoadingSpinner/>

    let totalLengthSeconds = 0
    if (album !== null)
      for (let item of album.tracklist)
        totalLengthSeconds += Number(item.lengthSeconds)

    return album === null ? null : (
      <div className={style['album']}>
        <div className={style['album-art']}>
          <div className={style['album-art-inner']}>
            <Image
              src={`/static/images/uploads/${album.image}_800`}
              alt={''}
              className={style['album-art-img']}
            />
          </div>
        </div>

        <table className={style['tracklist']}>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Length</th>
            </tr>
          </thead>

          <tbody>
            {album.tracklist.map((item, index) => (
              <tr key={index} className={style['track']}>
                <td className={style['track-number']}>{item.number}.</td>
                <td className={style['track-title']}>{item.name}</td>
                <td className={style['track-length']}>{
                  Utils.secondsToHoursMinutesSeconds(item.lengthSeconds)
                }</td>
              </tr>
            ))}
          </tbody>

          <tfoot className={style['total']}>
            <tr>
              <td colSpan={3}>Total: <span>{Utils.secondsToHoursMinutesSeconds(totalLengthSeconds)}</span></td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }
}

export default withRouter(Album)