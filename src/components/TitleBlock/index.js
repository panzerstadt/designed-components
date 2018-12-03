import React from "react";
import styles from "./index.module.css";

const TitleBlock = ({ style, text, dark }) => {
  const mode = dark ? styles.dark : styles.title;
  return (
    <div className={mode} style={style}>
      <h3>{text ? text : "title"}</h3>
    </div>
  );
};

export default TitleBlock;
