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
            again, or email our team.
          </p>
          <button className="button" onClick={() => window.location.reload()}>
            Reload the website ↗
          </button>
          <a href="mailto:info@medelec.in" className="text-link">
            Email info@medelec.in ↗
          </a>
        </div>
      )
    return this.props.children
  }
}
