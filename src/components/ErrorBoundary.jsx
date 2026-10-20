import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed)
      return (
        <div className="wrap empty-state">
          <p className="eyebrow">MEDELEC HEALTHCARE SOLUTIONS</p>
          <h1>Let’s get you reconnected.</h1>
          <p>
            A page update or connection issue interrupted loading. Reload to try
            again, or call our team.
          </p>
          <button className="button" onClick={() => window.location.reload()}>
            Reload the website ↗
          </button>
          <a href="tel:+919316666888" className="text-link">
            Call +91 93166 66888 ↗
          </a>
        </div>
      )
    return this.props.children
  }
}
