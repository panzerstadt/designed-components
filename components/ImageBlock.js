import React, { Component, Fragment } from "react";

import cred from "../../hidden/hidden.json";
const DummyBG = require("../../images/waiting.jpg");

export default class AutoBackground extends Component {
  constructor() {
    super();
    this.state = {
      imgs: "",
      search: "Title"
    };
    this._isMounted = false;
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // get a random nice image from unsplash or pexels
  fetchPhotos(query = null, random = true) {
    // if random == true, only get one
    // if random == false, get first one

    // APP_ID == access key. O_O dunno why
    const random_or_not = random ? "random" : "";
    const query_or_not = query ? "&query=" + query : "unicorn";

    const fetchUnsplash = (query = null, random = true) => {
      const url =
        "https://api.unsplash.com/photos/" +
        random +
        "?client_id=" +
        cred.unsplash.access_key +
        query;

      console.log("fetching from Unsplash: ", url);
      fetch(url)
        .then(result => result.json())
        .then(data => {
          console.log("fetched image from unsplash!");
          console.log(data);
          const output = [data].map(v => v.urls.regular);
          console.log(output);

          // i dunno man!!!!! only call when componentDidMount is fired.
          // so need to check if the component is mounted to avoid
          // calling setstate on unmounted component
          if (this._isMounted) {
            this.setState({
              imgs: random ? output : output[parseInt(Math.random() * 10, 10)]
            });
          }
        })
        .catch(error => {
          console.log("error while calling", error);
        });
    };

    const fetchPexels = () => {
      const url = `https://api.pexels.com/v1/search?query=${query_or_not}&per_page=15&page=1`;

      const options = {
        headers: {
          Authorization: `Bearer ${cred.pexels.access_key}`
        }
      };

      console.log("fetching from Pexels: ", url, options);
      fetch(url, options)
        .then(result => result.json())
        .then(data => {
          console.log("fetched image from pexels!");
          console.log(data);

          // transform into list of urls
          // decide size here
          const output = data.photos.map(v => {
            return v.src.large2x;
          });

          // i dunno man!!!!! only call when componentDidMount is fired.
          // so need to check if the component is mounted to avoid
          // calling setstate on unmounted component
          if (this._isMounted) {
            this.setState({
              imgs: random ? [output[parseInt(Math.random() * 10, 10)]] : output
            });
          }
        })
        .catch(error => {
          console.log("error while calling", error);
        });
    };

    const fetchImage = () => {
      this.setState({ imgs: "" });
      fetchUnsplash(query_or_not, random_or_not);

      setTimeout(() => {
        const chk = this.state.imgs;

        if (chk) {
          console.log(chk);
          console.log("fetching complete.");
        } else {
          console.log("unsplash seems to have failed. trying pexels.");
          console.log(chk);
          fetchPexels(query_or_not, random_or_not);
        }
      }, 2000);
    };

    fetchImage();
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchPhotos("globe", true);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleSearchChange(e) {
    // maybe use cleavejs here?
    this.setState({ search: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    // check if search query is valid first
    this.fetchPhotos(this.state.search);
  }

  handleDownload(e) {
    e.preventDefault();

    alert("this will download the high resolution image.");
  }

  render() {
    const { data } = this.props;
    const image = this.state.imgs;

    // console.log("at images page");
    // console.log(this.state.imgs);

    let bg_image = image ? image[0] : DummyBG;

    const bgStyle = {
      position: "fixed",
      zIndex: -10,
      top: -40,
      backgroundImage: `url(${bg_image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: window.innerHeight,
      width: "100%",
      margin: 0
    };

    const imgStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      objectFit: "cover",
      zIndex: 1
    };

    const formStyle = {
      backgroundColor: "none",
      zIndex: 10
    };

    const txtStyle = {
      fontSize: 70,
      fontWeight: 700,
      backgroundColor: "transparent",
      color: "white",
      border: "none",
      outline: "none",
      textAlign: "center"
    };

    if (!data || data.length === 0 || !this._isMounted) {
      console.log("mounted?", this._isMounted);
      return <div />;
    } else {
      console.log("mounted? ", this._isMounted);
      return (
        <Fragment>
          {/* bg image version */}
          {/* <div style={bgStyle} /> */}
          <div
            style={{
              position: "fixed",
              height: "100vh",
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <img
              style={imgStyle}
              src={bg_image}
              alt="image from either unsplash or pexels"
            />

            <form
              style={formStyle}
              id="image-search"
              onSubmit={this.handleSubmit}
            >
              <input
                style={txtStyle}
                type="text"
                value={this.state.search}
                onChange={this.handleSearchChange}
              />
            </form>
          </div>
        </Fragment>
      );
    }
  }
}
