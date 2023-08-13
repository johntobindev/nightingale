import React, { Component } from 'react'
import style from './style.scss'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { getQueryOptions, validDecades } from '../../../../../api/Albums/Validator'
import Dropdown, { DropdownLink } from './Dropdown'
import Utils from '../../../../../global/Utils'

type Props = {
  numAlbums: number,
  loading: boolean,
} & RouteComponentProps

interface State {
  decadeActive: boolean,
  sortByActive: boolean,
}

class Header extends Component<Props, State> {
  state = {
    decadeActive: false,
    sortByActive: false,
  }

  render() {
    const { numAlbums, loading } = this.props
    const { pathname, search } = this.props.location
    const queryOptions = getQueryOptions(search)
    const sortByDisabled = Utils.hasOwnProp(queryOptions, 'search')

    return (
      <div className={style['header']}>
        <div className={style['count']}>
          <span>{loading && numAlbums == 0 ? '?' : numAlbums}</span>
          &nbsp;album{(numAlbums == 0 || numAlbums > 1) && 's'}
        </div>

        <div className={style['options']}>
          <Dropdown
            active={this.state.decadeActive}
            name={'Decade'}
            toggle={() => this.setState({ decadeActive: !this.state.decadeActive })}
            hide={() => this.setState({ decadeActive: false })}
          >
            <li>
              <DropdownLink
                name={'decade'}
                value={undefined}
                pathname={pathname}
                queryOptions={queryOptions}
                disabled={false}
              >None</DropdownLink>
            </li>

            {validDecades.map((item, index) => (
              <li key={index}>
                <DropdownLink
                  name={'decade'}
                  value={item}
                  pathname={pathname}
                  queryOptions={queryOptions}
                  disabled={false}
                >{item + 's'}</DropdownLink>
              </li>
            ))}
          </Dropdown>

          <Dropdown
            active={this.state.sortByActive}
            name={'Sort by'}
            toggle={() => this.setState({ sortByActive: !this.state.sortByActive })}
            hide={() => this.setState({ sortByActive: false })}
          >
            {queryOptions['search'] !== undefined && (
              <li>
                <DropdownLink
                  name={'sortBy'}
                  value={undefined}
                  pathname={pathname}
                  queryOptions={queryOptions}
                  disabled={false}
                >Relevance</DropdownLink>
              </li>
            )}

            <li>
              <DropdownLink
                name={'sortBy'}
                value={undefined}
                pathname={pathname}
                queryOptions={queryOptions}
                disabled={sortByDisabled}
              >Year, desc</DropdownLink>
            </li>

            <li>
              <DropdownLink
                name={'sortBy'}
                value={'year-asc'}
                pathname={pathname}
                queryOptions={queryOptions}
                disabled={sortByDisabled}
              >Year, asc</DropdownLink>
            </li>

            <li>
              <DropdownLink
                name={'sortBy'}
                value={'album-asc'}
                pathname={pathname}
                queryOptions={queryOptions}
                disabled={sortByDisabled}
              >Album, asc</DropdownLink>
            </li>

            <li>
              <DropdownLink
                name={'sortBy'}
                value={'album-desc'}
                pathname={pathname}
                queryOptions={queryOptions}
                disabled={sortByDisabled}
              >Album, desc</DropdownLink>
            </li>

            <li>
              <DropdownLink
                name={'sortBy'}
                value={'artist-asc'}
                pathname={pathname}
                queryOptions={queryOptions}
                disabled={sortByDisabled}
              >Artist, asc</DropdownLink>
            </li>

            <li>
              <DropdownLink
                name={'sortBy'}
                value={'artist-desc'}
                pathname={pathname}
                queryOptions={queryOptions}
                disabled={sortByDisabled}
              >Artist, desc</DropdownLink>
            </li>
          </Dropdown>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)