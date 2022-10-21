/* eslint-disable no-shadow */
/* eslint-disable quotes */
// Copyright (c) 2017 PlanGrid, Inc.

import React, { Component } from "react";

import Error from "./error";
import Loading from "./loading";

function withFetching(WrappedComponent, props) {
  return class extends Component {
    constructor(props) {
      // eslint-disable-line no-shadow
      super(props);
      this.state = {};
      this.xhr = this.createRequest(props.filePath);
    }

    componentDidMount() {
      try {
        this.fetch();
        console.log("isFetching");
      } catch (e) {
        console.log("isCatching");
        if (this.props.onError) {
          this.props.onError(e);
        }
        this.setState({ error: "fetch error" });
      }
    }

    componentWillUnmount() {
      this.abort();
    }

    createRequest(path) {
      let xhr = new XMLHttpRequest();

      if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open("GET", path, true);
      } else if (typeof XDomainRequest !== "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open("GET", path);
      } else {
        // CORS not supported.
        console.log("cors");
        xhr = null;
        return null;
      }
      if (props.responseType) {
        xhr.responseType = props.responseType;
      }

      xhr.onerror = () => {
        console.log('ERROR');
        this.setState({ error: `fetch error with status ${xhr.status}` });
      };

      xhr.onload = () => {
        console.log("xhr onload", xhr);

        if (xhr.status >= 400) {
          this.setState({ error: `fetch error with status ${xhr.status}` });
          return;
        }
        const resp = props.responseType ? xhr.response : xhr.responseText;
        console.log("resp", resp);

        this.setState({ data: resp });
        console.log("reached?");
      };

      return xhr;
    }

    async fetch() {
      this.xhr.send();
    }

    abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }

    render() {
      console.log("render", this.xhr);

      if (!this.xhr) {
        console.log("case 1");
        return <h1>CORS not supported..</h1>;
      }

      if (this.state.error) {
        console.log("case 2");
        return <Error {...this.props} error={this.state.error} />;
      }

      if (this.state.data) {
        console.log("case 3");
        return <WrappedComponent data={this.state.data} {...this.props} />;
      }
      return <Loading />;
    }
  };
}

export default withFetching;
