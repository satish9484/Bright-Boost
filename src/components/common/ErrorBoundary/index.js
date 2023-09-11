import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../Utils';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            <div className='not-found'>
                <div className='not-found-inner'>
                    <figure>
                        <img src={toAbsoluteUrl('/assets/images/404-img.png')} alt="404-img" />
                    </figure>
                    <h5>Aw Snap!</h5>
                    <p>Something went wrong while displaying this page!</p>
                    <Link to="/" className="ant-btn ant-btn-primary orange-btn" style={{ textDecoration: "none" }}>Back to home</Link>
                </div>
            </div>
        }

        return this.props.children;
    }
}

export default ErrorBoundary