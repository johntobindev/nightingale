import { music as pool } from '../../server/databases/connections'
import messages from '../../global/messages'
import { ArtistType } from '../../client/state/artist/types'
import { ArtistsType } from '../../client/state/adminAlbum/types'
import { ValidArtist } from './Validator'
import { RowDataPacket } from 'mysql2/promise'
import ClientSafeError from '../../global/ClientSafeError'

export default class Artists {
  /**
   * Returns a single artist when provided with either of the following:
   * 1. an `artistSlug`
   * 2. an `artistId`
   */
  private static getArtistPrivate = async (artistSlug?: string, artistId?: string): Promise<ArtistType> => {
    let params: string[] = []

    let query = `
      SELECT CONVERT(id, CHAR) AS id,
             artist_name,
             slug,
             image
      FROM   Artists
    `

    if (artistId !== undefined) {
      query += ' WHERE id = ?'
      params.push(artistId)
    } else if (artistSlug !== undefined) {
      query += ' WHERE slug = ?'
      params.push(artistSlug)
    } else throw new Error(messages.STANDARD_ERROR)

    try {
      const [rows] = await pool.query<RowDataPacket[]>(query, params)

      if (rows.length === 0)
        throw new ClientSafeError('Artist not found')

      const row = rows[0] as GetArtistRow

      return createArtist(row)
    } catch (error) {
      if (error instanceof ClientSafeError) throw error
      throw new Error(messages.STANDARD_ERROR)
    }
  }

  static getArtist = (artistSlug: string) => this.getArtistPrivate(artistSlug)

  static getArtistById = (artistId: string) => this.getArtistPrivate(undefined, artistId)

  static getArtists = async (): Promise<ArtistsType> => {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT   CONVERT(id, CHAR) AS id,
                 artist_name AS name
        FROM     Artists
        ORDER BY artist_name ASC
      `, [])
      return rows as ArtistsType
    } catch (error) {
      throw new Error(messages.STANDARD_ERROR)
    }
  }

  static addArtist = async (artist: ValidArtist): Promise<void> => {
    try {
      await pool.query(`
        INSERT INTO Artists (artist_name, slug, image)
        VALUES      (?, ?, ?)
      `, [artist.name, artist.slug, artist.image])
    } catch (error) {
      if (error.errno === 1062)
        throw new Error('Artist already exists!')

      throw new Error(messages.STANDARD_ERROR)
    }
  }

  static updateArtist = async (artist: ValidArtist, id: string): Promise<void> => {
    try {
      await pool.query(`
        UPDATE Artists
        SET    artist_name = ?,
               slug = ?,
               image = ?
        WHERE  Artists.id = ?
      `, [artist.name, artist.slug, artist.image, id])
    } catch (error) {
      throw new Error(messages.STANDARD_ERROR)
    }
  }

  /** Delete artist AND artist's albums (and those albums' tracks) */
  static deleteArtist = async (id: string): Promise<void> => {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // Delete tracks first
      await connection.query(`
        DELETE Tracks FROM Tracks
        INNER JOIN Albums ON Albums.id = Tracks.album_id
        INNER JOIN Artists ON Artists.id = Albums.artist_id
        WHERE Artists.id = ?
      `, [id])

      // Then delete albums
      await connection.query(`
        DELETE Albums FROM Albums
        INNER JOIN Artists ON Artists.id = Albums.artist_id
        WHERE Artists.id = ?
      `, [id])

      // Finally delete the artist
      await connection.query('DELETE FROM Artists WHERE id = ?', [id])

      await connection.commit()
      connection.release()
    } catch (error) {
      await connection.rollback()
      connection.release()
      throw new Error(messages.STANDARD_ERROR)
    }
  }
}

// Results as received from database
interface GetArtistRow {
  id: string,
  artist_name: string,
  slug: string,
  image: string,
}

const createArtist = (results: GetArtistRow): ArtistType => ({
  id: results.id,
  name: results.artist_name,
  image: results.image,
  slug: results.slug,
})