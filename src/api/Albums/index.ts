import { music as pool } from '../../server/databases/connections'
import messages from '../../global/messages'
import { AlbumType } from '../../client/state/album/types'
import { perPage, ValidAlbum, ValidOptions } from './Validator'
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import ClientSafeError from '../../global/ClientSafeError'

const separator = '#SEPARATOR#'

export default class Albums {
  /**
   * Returns a single album when provided with either of the following:
   * 1. both an `artistSlug` and `albumSlug`
   * 2. an `albumId`
   */
  private static getAlbumPrivate = async (
    artistSlug?: string,
    albumSlug?: string,
    albumId?: string,
  ): Promise<AlbumType> => {
    let params: (string | number)[] = []

    let query = `
      SELECT      CONVERT(Albums.id, CHAR) AS id,
                  Albums.album_name,
                  Albums.slug,
                  Albums.image,
                  CONVERT(Albums.album_year, CHAR) AS album_year,
                  CONVERT(Albums.artist_id, CHAR) AS artist_id,
                  Artists.artist_name,
                  Artists.slug AS artist_slug,
                  Artists.image AS artist_image,
                  GROUP_CONCAT(
                    DISTINCT CONCAT(
                      Tracks.id,
                      '${separator}',
                      Tracks.track_number,
                      '${separator}',
                      Tracks.track_name,
                      '${separator}',
                      Tracks.length_seconds
                    )
                    SEPARATOR '${separator}'
                  ) AS tracklist
      FROM       Albums
      INNER JOIN Artists ON Artists.id = Albums.artist_id
      INNER JOIN Tracks ON Tracks.album_id = Albums.id
    `

    if (albumId !== undefined) {
      query += ' WHERE Albums.id = ?'
      params.push(albumId)
    } else if (artistSlug !== undefined && albumSlug !== undefined) {
      query += ' '
      query += `
        WHERE Albums.slug = ?
        AND   Artists.slug = ?
      `
      params.push(albumSlug, artistSlug)
    } else throw new Error(messages.STANDARD_ERROR)

    try {
      const [rows] = await pool.query<RowDataPacket[]>(query, params)

      if (rows.length === 0 || rows[0].id === null)
        throw new ClientSafeError('Album not found')

      const row = rows[0] as GetAlbumRow
      return createAlbum(row)
    } catch (error) {
      if (error instanceof ClientSafeError) throw error
      throw new Error(messages.STANDARD_ERROR)
    }
  }

  static getAlbum = (artistSlug: string, albumSlug: string) => this.getAlbumPrivate(artistSlug, albumSlug)

  static getAlbumById = (id: string) => this.getAlbumPrivate(undefined, undefined, id)

  static getNumAlbums = async (options: ValidOptions): Promise<number> => {
    let params: any[] = []

    let query = `
      SELECT     COUNT(DISTINCT(Albums.id)) AS numAlbums
      FROM       Albums
      INNER JOIN Artists ON Artists.id = Albums.artist_id
      INNER JOIN Tracks ON Tracks.album_id = Albums.id
    `

    if (options.artistSlug !== null) {
      query += ' WHERE Artists.slug = ?'
      params.push(options.artistSlug)
    }

    if (options.decade !== null) {
      if (options.artistSlug === null) query += ' WHERE'
      else query += ' AND'
      query += ' Albums.album_year >= ? AND Albums.album_year <= ?'
      params.push(options.decade, String(Number(options.decade) + 9))
    }

    if (options.search !== null) {
      if (options.artistSlug === null && options.decade === null) query += ' WHERE'
      else query += ' AND'
      query += ' '
      query += `
        (MATCH(Artists.artist_name, Artists.aliases) AGAINST(? IN BOOLEAN MODE)
        OR MATCH(Albums.album_name, Albums.aliases) AGAINST(? IN BOOLEAN MODE)
        OR Tracks.track_name LIKE ?)
      `
      params.push(options.search, options.search, '%' + options.search + '%')
    }

    try {
      const [rows] = await pool.query<RowDataPacket[]>(query, params)
      const row = rows[0] as GetNumAlbumsRow
      return row.numAlbums
    } catch (error) {
      throw new Error(messages.STANDARD_ERROR)
    }
  }

  static getAlbums = async (options: ValidOptions): Promise<AlbumType[]> => {
    let params: (string | number)[] = []

    let query = `
      SELECT Albums.id,
             Albums.album_name,
             Albums.slug,
             Albums.image,
             Albums.album_year,
             Albums.artist_id,
             Artists.artist_name,
             Artists.slug AS artist_slug,
             Artists.image AS artist_image,
             GROUP_CONCAT(
               DISTINCT CONCAT(
                 Tracks.track_number,
                 '${separator}',
                 Tracks.track_name,
                 '${separator}',
                 Tracks.length_seconds
               )
               SEPARATOR '${separator}'
             ) AS tracklist
    `

    if (options.search !== null) {
      query += `
        ,
        MATCH(Artists.artist_name, Artists.aliases) AGAINST(? IN BOOLEAN MODE) AS artist_score,
        MATCH(Albums.album_name, Albums.aliases) AGAINST(? IN BOOLEAN MODE) AS album_score
      `
      params.push(options.search, options.search)
    }

    query += ' '
    query += `
      FROM       Albums
      INNER JOIN Artists ON Artists.id = Albums.artist_id
      INNER JOIN Tracks ON Tracks.album_id = Albums.id
    `

    if (options.artistSlug !== null) {
      query += ' WHERE Artists.slug = ?'
      params.push(options.artistSlug)
    }

    if (options.decade !== null) {
      if (options.artistSlug === null) query += ' WHERE'
      else query += ' AND'
      query += ' Albums.album_year >= ? AND Albums.album_year <= ?'
      params.push(options.decade, String(Number(options.decade) + 9))
    }

    if (options.search !== null) {
      if (options.artistSlug === null && options.decade === null) query += ' WHERE'
      else query += ' AND'
      query += ' '
      query += `
        (MATCH(Artists.artist_name, Artists.aliases) AGAINST(? IN BOOLEAN MODE)
        OR MATCH(Albums.album_name, Albums.aliases) AGAINST(? IN BOOLEAN MODE)
        OR Tracks.track_name LIKE ?)
      `
      params.push(options.search, options.search, '%' + options.search + '%')
    }

    // GROUP BY required due to method of track selection
    query += ' '
    query += 'GROUP BY Albums.id'

    if (options.search !== null) {
      query += ' '
      query += 'ORDER BY (artist_score + album_score) DESC'
    } else {
      query += ' '
      if (options.sortBy === 'year-asc') {
        query += 'ORDER BY Albums.album_year ASC'
      } else if (options.sortBy === 'album-asc') {
        query += 'ORDER BY Albums.album_name ASC'
      } else if (options.sortBy === 'album-desc') {
        query += 'ORDER BY Albums.album_name DESC'
      } else if (options.sortBy === 'artist-asc') {
        query += 'ORDER BY Artists.artist_name ASC'
      } else if (options.sortBy === 'artist-desc') {
        query += 'ORDER BY Artists.artist_name DESC'
      } else {
        query += 'ORDER BY Albums.album_year DESC'
      }
      query += ', Albums.album_year DESC, Artists.artist_name ASC, Albums.album_name ASC'
    }

    query += ' LIMIT ?, ?'

    params.push(
      options.page === null ? 0 : (Number(options.page) - 1) * perPage,
      perPage,
    )

    try {
      const [rows] = await pool.query<RowDataPacket[]>(query, params)

      if (rows.length === 0)
        throw new ClientSafeError(messages.NO_RESULTS)

      let albums: AlbumType[] = []

      for (let row of rows as GetAlbumRow[])
        albums.push(createAlbum(row))

      return albums
    } catch (error) {
      if (error instanceof ClientSafeError) throw error
      throw new Error(messages.STANDARD_ERROR)
    }
  }

  static addAlbum = async (album: ValidAlbum): Promise<void> => {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // First add the album
      const [header] = await connection.query<ResultSetHeader>(`
        INSERT INTO Albums (album_name, slug, image, album_year, artist_id)
        VALUES      (?, ?, ?, ?, ?)
      `, [album.name, album.slug, album.image, album.year, album.artistId])

      const albumId = header.insertId

      // Then add the tracks
      await connection.query(`
        INSERT INTO Tracks (track_name, track_number, length_seconds, album_id)
        VALUES      ?
      `, prepareTracksParams(album.tracks, albumId))

      await connection.commit()
      connection.release()
    } catch (error) {
      await connection.rollback()
      connection.release()

      if (error.errno === 1062)
        throw new Error('Album already exists!')

      throw new Error(messages.STANDARD_ERROR)
    }
  }

  static updateAlbum = async (album: ValidAlbum, id: string, deletedTracks?: string[]): Promise<void> => {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()
      await connection.query(`
        UPDATE Albums
        SET    album_name = ?,
               slug = ?,
               image = ?,
               album_year = ?,
               artist_id = ?
        WHERE  id = ?
      `, [album.name, album.slug, album.image, album.year, album.artistId, id])

      // Subsequent queries gathered in this array to be run concurrently
      let queries: Promise<any>[] = []

      if (deletedTracks !== undefined)
        for (let deletedTrack of deletedTracks)
          queries.push(connection.query('DELETE FROM Tracks WHERE id = ?', [deletedTrack]))

      for (let track of album.tracks) {
        // If id provided, update existing track
        if (track.id !== undefined)
          queries.push(connection.query(`
            UPDATE Tracks
            SET    track_name = ?,
                   track_number = ?,
                   length_seconds = ?
            WHERE  id = ?
          `, [track.name, track.number, track.lengthSeconds, track.id]))
        // If no id provided, add new track
        else queries.push(connection.query(`
          INSERT INTO Tracks (track_name, track_number, length_seconds, album_id)
          VALUES      (?, ?, ?, ?)
        `, [track.name, track.number, track.lengthSeconds, id]))
      }

      await Promise.all(queries)
      await connection.commit()
      connection.release()
    } catch (error) {
      await connection.rollback()
      connection.release()
      throw new Error(messages.STANDARD_ERROR)
    }
  }

  static deleteAlbum = async (id: string): Promise<void> => {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()
      // Tracks must be deleted first due to constraint
      await connection.query('DELETE FROM Tracks WHERE album_id = ?', [id])
      await connection.query('DELETE FROM Albums WHERE id = ?', [id])
      await connection.commit()
      connection.release()
    } catch (error) {
      await connection.rollback()
      connection.release()
      throw new Error(messages.STANDARD_ERROR)
    }
  }
}

interface GetAlbumRow {
  id: string,
  album_name: string,
  slug: string,
  image: string,
  album_year: string,
  artist_id: string,
  artist_name: string,
  artist_slug: string,
  artist_image: string,
  tracklist: string,
}

interface GetNumAlbumsRow {
  numAlbums: number,
}

// From the database row, create an album of the type expected for our state
const createAlbum = (results: GetAlbumRow): AlbumType => {
  let tracklist: AlbumType['tracklist'] = []

  // Check is string (i.e. tracks exist) to avoid split on null error
  if (typeof results.tracklist === 'string') {
    const numProps = 4
    // Split tracklist string to array. Note: tracklist is a contiguous string
    // of track properties, grouped by track and separated by a predefined
    // `separator`. For example, assuming a `numProps` of 2, and using * as a
    // separator, the string for an album with 3 tracks would resemble the
    // following:
    // track1prop1*track1prop2*track2prop1*track2prop2*track3prop1*track3prop2
    const trackProps = results.tracklist.split(separator)

    // Convert `trackProps` into an array of track objects. The number of
    // tracks is the length of `trackProps` divided by `numProps`, so we'll run
    // a loop as many times as there are tracks and insert a track object into
    // our `tracklist` each time
    for (let i = 0; i < trackProps.length / numProps; i++) {
      // In `trackProps`, a new track starts after every `numProps` props
      const trackStartPosition = i * numProps
      // Get the group of props for this track
      const slice = trackProps.slice(trackStartPosition, trackStartPosition + numProps)

      tracklist[i] = {
        id: slice[0],
        number: slice[1],
        name: slice[2],
        lengthSeconds: slice[3],
      }
    }

    // Order by track number
    tracklist.sort((a, b) => Number(a.number) - Number(b.number))
  }

  return {
    id: results.id,
    artist: {
      id: results.artist_id,
      name: results.artist_name,
      image: results.artist_image,
      slug: results.artist_slug,
    },
    name: results.album_name,
    image: results.image,
    year: results.album_year,
    slug: results.slug,
    tracklist,
  }
}

// From an array of track objects, prepare an array of params for a bulk insert
// We need an array of arrays of values, wrapped in an array. For example:
// [[['track1prop1', 'track1prop2'], ['track2prop1', 'track2prop2']]]
const prepareTracksParams = (tracks: ValidAlbum['tracks'], albumId: number): (string | number)[][][] => {
  let tracksParams: (string | number)[][] = []

  for (let track of tracks)
    // Must match values insert order in query
    tracksParams.push([
      track.name,
      track.number,
      track.lengthSeconds,
      albumId,
    ])

  return [tracksParams]
}