import React, { Component } from "react";

import cred from "../hidden/hidden.json";
const DummyBG = require("../assets/images/waiting.jpg");

const imgStyle = {
  position: "relative",
  height: "100%",
  width: "100%",
  objectFit: "cover",
  zIndex: 1
};

const formStyle = {
  position: "absolute",
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

class ImageDiv extends Component {
  render() {
    console.log("checking for image");
    console.log(this.props.image);
    const borderHighlight = this.props.image
      ? null
      : { border: "2px dashed salmon" };
    return (
      <img
        style={{ ...imgStyle, ...borderHighlight }}
        src={this.props.image}
        alt="image from either unsplash or pexels"
      />
    );
  }
}

class TextDiv extends Component {
  state = {
    search: "Title"
  };
  handleSearchChange = this.handleSearchChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);

  handleSearchChange(e) {
    // maybe use cleavejs here?
    this.setState({ search: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    // check if search query is valid first
    if (this.props.handleSubmit) {
      this.props.handleSubmit(this.state.search);
    } else {
      console.debug(
        "could not find this.props.handleSubmit. not calling parent function"
      );
    }
  }

  render() {
    return (
      <form style={formStyle} id="image-search" onSubmit={this.handleSubmit}>
        <input
          style={txtStyle}
          type="text"
          value={this.state.search}
          onChange={this.handleSearchChange}
        />
      </form>
    );
  }
}

export default class ImageBlock extends Component {
  state = {
    imgs: null,
    error: null,
    search: "Title",
    parentDim: {
      height: "100%",
      width: "100%"
    }
  };
  divRef = React.createRef();
  fetchPhotos = this.fetchPhotos.bind(this);

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

          this.setState({
            imgs: random ? output : output[parseInt(Math.random() * 10, 10)]
          });
        })
        .catch(error => {
          console.debug("error while calling unsplash", error);
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

          this.setState({
            imgs: random ? [output[parseInt(Math.random() * 10, 10)]] : output
          });
        })
        .catch(error => {
          console.log("error while calling", error);
        });
    };

    const fetchImage = () => {
      this.setState({ imgs: null });
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
      }, 3000);
    };

    fetchImage();
  }

  componentDidMount() {
    this.fetchPhotos("globe", true);

    const dims = this.divRef.current.parentNode;
    if (dims) {
      // prevents breaking when used without parent div
      this.setState({
        parentDim: {
          height: dims.clientHeight,
          width: dims.clientWidth
        }
      });
    }
  }

  handleDownload(e) {
    e.preventDefault();

    alert("this will download the high resolution image.");
  }

  render() {
    const { data, height } = this.props;
    const image = this.state.imgs;

    // console.log("at images page");
    // console.log(this.state.imgs);

    // first finish off all the images here
    let bg_image = image ? image[0] : null;

    return (
      <div
        ref={this.divRef}
        style={{
          height: height ? height : this.state.parentDim.height,
          width: this.state.parentDim.width,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <p style={{ position: "absolute" }}>{this.state.error}</p>
        <ImageDiv image={bg_image} />
        <TextDiv handleSubmit={this.fetchPhotos} />
      </div>
    );
  }
}
