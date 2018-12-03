import React, { Component, Fragment } from "react";
import logo from "./logo.svg";
import "./App.css";

// newsletter components
import ImageBlock from "./components/ImageBlock";
import TitleBlock from "./components/TitleBlock";
import TextBlock from "./components/TextBlock";

class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <a
          style={{ margin: 0, padding: 0 }}
          href="https://www.slatejs.org/#/rich-text"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logo} className="App-logo" alt="logo" />
        </a>
      </header>
    );
  }
}

const Tab = ({ index, title, onClick }) => {
  return (
    <div key={`tab-${index}`} className="editor-tab">
      <button onClick={onClick}>{title ? title : "TAB"}</button>
    </div>
  );
};

const Sidebar = ({ children }) => {
  return <div className="editor-sidebar">{children}</div>;
};

const Content = ({ children, displayWidth, zoom, spacing }) => {
  const finalZoom = zoom ? zoom : 1;

  const childrenOut = children.map((c, i) => {
    return (
      <Fragment>
        {i === 0 || i === children[children.length - 1] ? null : (
          <div
            className="editor-spacer"
            style={{ height: spacing ? spacing : 50 }}
          />
        )}
        {c}
      </Fragment>
    );
  });

  return (
    <Fragment>
      <code className="editor-info-label">
        {displayWidth}px ({finalZoom * 100})%
      </code>
      <div
        className="editor-content"
        style={{ width: displayWidth * finalZoom }}
      >
        {childrenOut}
      </div>
    </Fragment>
  );
};

class Editor extends Component {
  state = {
    width: 840,
    zoom: 1,
    whitespace: 50
  };
  render() {
    return (
      <div className="editor">
        <Sidebar>
          <Tab
            index="1"
            title="content"
            onClick={() => alert("tab 1 clicked!")}
          />
          <Tab
            index="2"
            title="components"
            onClick={() => alert("tab 2 clicked!")}
          />
          <Tab index="3" title="help" onClick={() => alert("tab 3 clicked!")} />
        </Sidebar>
        <br />
        <code>mock editor.</code>
        <br />
        <Content displayWidth={this.state.width * this.state.zoom}>
          {/* todo: all content should be DnD */}
          <TitleBlock />
          <ImageBlock height={500} />
          <TitleBlock />
          <ImageBlock height={200} />
          <TextBlock />
          <ImageBlock height={300} />
          <TextBlock />
          <TitleBlock dark />
        </Content>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Editor />
      </div>
    );
  }
}

export default App;
