import React from 'react'
import { Link } from 'react-router-dom'
import { toAbsoluteUrl } from '../Utils'

const PageNotFound = () => {
  return (
    <>
      <div className='not-found'>
        <div className='not-found-inner'>
          <figure>
            <img src={toAbsoluteUrl('/assets/images/404-img.png')} alt="404-img" />
          </figure>
          <h5>404</h5>
          <p>Sorry, you are not authorized to access this page.</p>
          <Link to="/" className="ant-btn ant-btn-primary orange-btn" style={{textDecoration: "none"}}>Back to home</Link>
          </div>
      </div>
    </>
  )
}

export default PageNotFound